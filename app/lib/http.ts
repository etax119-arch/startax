export type JsonResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const NETWORK_ERROR = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

/**
 * 클라이언트에서 JSON API 를 호출할 때의 공통 처리.
 * 우리 API 라우트는 실패 시 항상 `{ error: string }` 을 돌려주므로,
 * 그 계약을 여기 한 곳에서만 알면 됩니다.
 */
export async function requestJson<T = unknown>(
  url: string,
  init?: RequestInit,
  fallbackError = '요청을 처리하지 못했습니다.'
): Promise<JsonResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // 204 처럼 본문이 없는 응답도 있으므로 파싱 실패 자체는 오류가 아닙니다.
  }

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && typeof (data as { error?: unknown }).error === 'string'
        ? (data as { error: string }).error
        : fallbackError;
    return { ok: false, error: message };
  }

  return { ok: true, data: data as T };
}

export async function postJson<T = unknown>(
  url: string,
  body: unknown,
  fallbackError?: string
): Promise<JsonResult<T>> {
  return requestJson<T>(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    fallbackError
  );
}
