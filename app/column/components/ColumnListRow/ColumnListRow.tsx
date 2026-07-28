import Image from 'next/image';
import Link from 'next/link';
import styles from './ColumnListRow.module.css';
import { SITE_NAME } from '../../../lib/site';
import { formatColumnDate } from '../../../lib/columns/format';
import { buildColumnHref } from '../../../lib/columns/href';
import type { ColumnListItem } from '../../../lib/columns/types';

export default function ColumnListRow({ item }: { item: ColumnListItem }) {
  const date = formatColumnDate(item.published_at ?? item.created_at);
  const hasThumbnail = Boolean(item.thumbnail_url);

  return (
    <Link
      href={buildColumnHref(item.slug)}
      className={`${styles.row} ${hasThumbnail ? '' : styles.rowNoThumb}`}
    >
      <div className={styles.body}>
        <div className={styles.source}>
          <span>{SITE_NAME}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.category}>{item.category}</span>
        </div>

        <h2 className={styles.title}>{item.title}</h2>

        {item.excerpt && <p className={styles.excerpt}>{item.excerpt}</p>}

        {date && (
          <time className={styles.date} dateTime={item.published_at ?? item.created_at}>
            {date}
          </time>
        )}
      </div>

      {item.thumbnail_url && (
        <div className={styles.thumb}>
          <Image
            src={item.thumbnail_url}
            alt=""
            fill
            sizes="(max-width: 768px) 96px, 148px"
            className={styles.thumbImage}
          />
        </div>
      )}
    </Link>
  );
}
