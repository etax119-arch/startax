export const SITE_URL = 'https://www.startaxltd.com';
export const SITE_NAME = '세무법인 스타택스';
export const SITE_LOGO_URL = `${SITE_URL}/assets/used/logo/startax_logo.png`;

export const FEED_PATH = '/feed.xml';
export const FEED_URL = `${SITE_URL}${FEED_PATH}`;
export const FEED_TITLE = `칼럼 | ${SITE_NAME}`;
export const FEED_DESCRIPTION =
  '세무법인 스타택스가 현장에서 마주한 세금 이슈를 정리해 전해드립니다.';

/**
 * <link rel="alternate" type="application/rss+xml"> 를 만드는 metadata 조각입니다.
 * Next 는 자식 페이지의 `alternates` 가 부모 것을 통째로 대체하므로,
 * alternates 를 직접 정의하는 페이지는 이 값을 함께 펼쳐 넣어야 피드 링크가 남습니다.
 */
export const FEED_ALTERNATE_TYPES = {
  'application/rss+xml': [{ url: FEED_URL, title: FEED_TITLE }],
};
