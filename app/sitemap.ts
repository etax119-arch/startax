import type { MetadataRoute } from 'next';
import { SITE_URL } from './lib/site';
import { getAllPublishedSlugs } from './lib/columns/queries';
import { COLUMN_BASE_PATH, buildColumnHref } from './lib/columns/href';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = '2026-02-27';

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/services/tax`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services/consulting`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services/hospital-consulting`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}${COLUMN_BASE_PATH}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  let columnEntries: MetadataRoute.Sitemap = [];
  try {
    const rows = await getAllPublishedSlugs();
    columnEntries = rows.map((row) => ({
      url: `${SITE_URL}${buildColumnHref(row.slug)}`,
      lastModified: row.updated_at,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    // Supabase 일시 장애로 사이트맵이 500 이 나면 구글이 기존 정적 URL 까지
    // 전부 드랍합니다. 칼럼만 빠지고 나머지는 살아남게 합니다.
    console.error('sitemap: failed to load columns', err);
  }

  return [...staticEntries, ...columnEntries];
}
