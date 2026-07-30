import {
  FEED_DESCRIPTION,
  FEED_TITLE,
  FEED_URL,
  SITE_URL,
} from '../lib/site';
import { COLUMN_BASE_PATH, buildColumnHref } from '../lib/columns/href';
import { listRecentPublishedColumns } from '../lib/columns/queries';

// 사이트맵과 같은 주기로 갱신하고, 글을 저장하면 revalidateColumns 가 즉시 비웁니다.
export const revalidate = 3600;

const FEED_ITEM_LIMIT = 20;

/** XML 텍스트 노드/속성에 안전하게 넣기 위한 이스케이프. 제목·요약이 관리자 입력이므로 필수입니다. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS 2.0 의 pubDate 는 RFC 822 형식이어야 합니다. toUTCString() 이 이 형식을 만듭니다. */
function toRfc822(iso: string | null): string {
  const date = iso ? new Date(iso) : new Date();
  return (Number.isNaN(date.getTime()) ? new Date() : date).toUTCString();
}

export async function GET() {
  let items: Awaited<ReturnType<typeof listRecentPublishedColumns>> = [];

  try {
    items = await listRecentPublishedColumns(FEED_ITEM_LIMIT);
  } catch (err) {
    // 사이트맵과 같은 이유로 절대 500 을 내지 않습니다 — 네이버/구글이 피드를
    // 오류로 기억하면 재수집 주기가 늘어집니다. 빈 채널이라도 유효한 XML 을 줍니다.
    console.error('feed.xml: failed to load columns', err);
  }

  const lastBuildDate = toRfc822(items[0]?.published_at ?? items[0]?.created_at ?? null);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}${COLUMN_BASE_PATH}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
${items
  .map((item) => {
    const url = `${SITE_URL}${buildColumnHref(item.slug)}`;
    return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(item.excerpt)}</description>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${toRfc822(item.published_at ?? item.created_at)}</pubDate>
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
