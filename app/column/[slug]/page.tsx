import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import BlockRenderer from '../components/BlockRenderer';
import { FEED_ALTERNATE_TYPES, SITE_LOGO_URL, SITE_NAME, SITE_URL } from '../../lib/site';
import { buildExcerpt, resolveCoverUrl } from '../../lib/columns/blocks';
import { formatColumnDate } from '../../lib/columns/format';
import { COLUMN_BASE_PATH, buildColumnHref, buildColumnListHref } from '../../lib/columns/href';
import { getPublishedColumnBySlug } from '../../lib/columns/queries';
import type { ColumnRow } from '../../lib/columns/types';

// 온디맨드 렌더 + Full Route Cache. 관리자 저장 시 revalidatePath 로 즉시 갱신됩니다.
// generateStaticParams 는 의도적으로 쓰지 않습니다 — 빌드가 Supabase 연결에
// 의존하게 되고, 환경변수가 없으면 조용히 빈 사이트가 나옵니다.
export const revalidate = 3600;

interface ColumnDetailProps {
  params: Promise<{ slug: string }>;
}

function resolveDescription(column: ColumnRow): string {
  return column.excerpt || buildExcerpt(column.blocks);
}

/** 대표 이미지 → 본문 첫 이미지·유튜브 썸네일 → 사이트 기본 OG 이미지 순으로 폴백합니다. */
function resolveImage(column: ColumnRow): string {
  return resolveCoverUrl(column.thumbnail_url, column.blocks) ?? `${SITE_URL}/opengraph-image`;
}

export async function generateMetadata({ params }: ColumnDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const column = await getPublishedColumnBySlug(decodeURIComponent(slug));

  if (!column) {
    return {
      title: `칼럼을 찾을 수 없습니다 | ${SITE_NAME}`,
      robots: { index: false, follow: true },
    };
  }

  const url = `${SITE_URL}${buildColumnHref(column.slug)}`;
  const description = resolveDescription(column);
  const image = resolveImage(column);

  return {
    title: `${column.title} | ${SITE_NAME}`,
    description,
    // types 를 함께 넣지 않으면 부모 layout 의 RSS 링크가 이 페이지에서 사라집니다.
    alternates: { canonical: url, types: FEED_ALTERNATE_TYPES },
    openGraph: {
      type: 'article',
      url,
      title: column.title,
      description,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      publishedTime: column.published_at ?? column.created_at,
      modifiedTime: column.updated_at,
      // 크기를 단정하지 않습니다 — 대표 이미지는 어떤 비율이든 올 수 있어서,
      // 1200x630 으로 못박으면 세로 사진일 때 공유 미리보기가 잘못 잘립니다.
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: column.title,
      description,
      images: [image],
    },
  };
}

export default async function ColumnDetailPage({ params }: ColumnDetailProps) {
  const { slug } = await params;
  const column = await getPublishedColumnBySlug(decodeURIComponent(slug));

  if (!column) {
    notFound();
  }

  const url = `${SITE_URL}${buildColumnHref(column.slug)}`;
  const description = resolveDescription(column);
  const image = resolveImage(column);
  const publishedIso = column.published_at ?? column.created_at;
  const publishedDate = formatColumnDate(publishedIso);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    // 구글 권장 상한이 110자입니다.
    headline: column.title.slice(0, 110),
    description,
    image: [image],
    datePublished: publishedIso,
    dateModified: column.updated_at,
    articleSection: column.category,
    inLanguage: 'ko',
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: SITE_LOGO_URL },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '칼럼', item: `${SITE_URL}${COLUMN_BASE_PATH}` },
      { '@type': 'ListItem', position: 3, name: column.title, item: url },
    ],
  };

  return (
    <article className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className={styles.body}>
        <nav className={styles.breadcrumb} aria-label="위치">
          <Link href={COLUMN_BASE_PATH}>칼럼</Link>
          <span aria-hidden="true">›</span>
          <Link href={buildColumnListHref({ category: column.category })}>{column.category}</Link>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>{column.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>{SITE_NAME}</span>
            {publishedDate && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={publishedIso}>{publishedDate}</time>
              </>
            )}
          </div>
        </header>

        {column.thumbnail_url && (
          <div className={styles.hero}>
            <Image
              src={column.thumbnail_url}
              alt=""
              width={1200}
              height={675}
              sizes="(max-width: 800px) 100vw, 760px"
              className={styles.heroImage}
              priority
            />
          </div>
        )}

        <BlockRenderer blocks={column.blocks} columnTitle={column.title} />

        <div className={styles.footer}>
          <Link href={COLUMN_BASE_PATH} className={styles.backLink}>
            ← 칼럼 목록으로
          </Link>
        </div>
      </div>
    </article>
  );
}
