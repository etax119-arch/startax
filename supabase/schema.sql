-- ============================================================================
-- STARTAX 칼럼(Column) 기능 스키마
-- ----------------------------------------------------------------------------
-- 이 파일은 문서용입니다. 애플리케이션이 실행하지 않습니다.
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 한 번 실행하세요.
-- ============================================================================

-- ── 확장 ────────────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists pg_trgm;    -- 한국어 부분일치 검색용 trigram

-- ── 테이블 ──────────────────────────────────────────────────────────────────
create table if not exists public.columns (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  category      text not null
                  check (category in ('세무', '병의원', '경영컨설팅', '세무상식')),
  excerpt       text not null default '',
  thumbnail_url text,
  blocks        jsonb not null default '[]'::jsonb,
  -- 제목 + 요약 + 본문 평문을 합친 검색용 컬럼.
  -- 서버가 insert/update 시마다 계산해서 저장합니다 (app/lib/columns/blocks.ts).
  search_text   text not null default '',
  published     boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint columns_blocks_is_array check (jsonb_typeof(blocks) = 'array')
);

comment on column public.columns.blocks is
  'ColumnBlock(paragraph | heading | image | youtube)의 순서 있는 배열. app/lib/columns/types.ts 참고. paragraph 는 인라인 노드 배열(content)을 쓰며, 옛 글은 평문 text 필드로 남아 있어도 읽을 때 변환됩니다 (app/lib/columns/inline.ts)';

comment on column public.columns.category is
  '위 CHECK 목록은 app/lib/columns/constants.ts 의 COLUMN_CATEGORIES 와 반드시 일치해야 합니다. 코드만 고치면 저장 시 23514 로 실패합니다.';

-- ── 인덱스 ──────────────────────────────────────────────────────────────────
create index if not exists columns_published_idx
  on public.columns (published, published_at desc nulls last, created_at desc);

create index if not exists columns_category_idx
  on public.columns (category) where published;

create index if not exists columns_search_idx
  on public.columns using gin (search_text gin_trgm_ops);

-- 관리자 목록은 미발행 글까지 updated_at 내림차순으로 페이지네이션합니다
-- (app/lib/columns/adminQueries.ts). 이 인덱스가 없으면 매번 전체 정렬이 일어납니다.
create index if not exists columns_updated_at_idx
  on public.columns (updated_at desc);

-- ── updated_at 자동 갱신 ────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists columns_set_updated_at on public.columns;
create trigger columns_set_updated_at
  before update on public.columns
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.columns enable row level security;

-- 공개(anon/authenticated)는 발행된 글만 읽을 수 있습니다.
drop policy if exists "columns_public_select_published" on public.columns;
create policy "columns_public_select_published"
  on public.columns for select
  to anon, authenticated
  using (published = true);

-- insert / update / delete 정책은 의도적으로 만들지 않습니다.
-- service_role 키는 RLS를 우회하므로, 모든 쓰기는 서버(app/api/admin/*)에서만
-- service_role 키로 수행됩니다.

-- ── Storage 버킷 ────────────────────────────────────────────────────────────
-- public: true 이므로 storage.objects 에 별도 SELECT 정책 없이 CDN 읽기가 됩니다.
-- 업로드는 service_role 로만 하므로 insert/update/delete 정책도 만들지 않습니다.
insert into storage.buckets (id, name, public)
values ('column-images', 'column-images', true)
on conflict (id) do nothing;

-- 객체 키 규칙: columns/{YYYY}/{MM}/{uuid}.{ext}
-- 공개 URL:    https://<project-ref>.supabase.co/storage/v1/object/public/column-images/<path>

-- 첨부 파일용 버킷. 이미지와 분리해 두면 허용 형식과 Content-Type 정책이 섞이지 않습니다.
insert into storage.buckets (id, name, public)
values ('column-files', 'column-files', true)
on conflict (id) do nothing;

-- 저장 Content-Type 은 서버가 확장자에서 고르며 대개 application/octet-stream 입니다.
-- 링크에는 ?download=<파일명> 이 붙어 Content-Disposition: attachment 로 내려갑니다.
-- 그래서 확장자를 위장한 파일이 올라와도 브라우저에서 실행되지 않습니다.
-- 허용 확장자는 app/lib/columns/constants.ts 의 ALLOWED_FILE_EXTENSIONS 가 단일 출처입니다.
