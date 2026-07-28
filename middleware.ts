import { NextRequest, NextResponse } from 'next/server';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

// POST 요청에 대해 IP당 분당 5회로 제한할 경로들.
// /api/admin/login 은 비밀번호 무차별 대입을 막기 위함입니다.
const RATE_LIMITED_PATHS = new Set(['/api/send-email', '/api/admin/login']);

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * 같은 출처에서 온 변경 요청만 허용합니다.
 * 핸들러마다 반복하는 대신 여기 한 곳에서 강제하므로, 새 /api 라우트를 추가할 때
 * 검사를 빠뜨릴 수 없습니다. Origin 헤더가 없는 요청(서버 간 호출, 일부 구형
 * 클라이언트)은 통과시키고, 인증이 필요한 경로는 그 뒤 쿠키 검사로 걸러집니다.
 */
function isCrossOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    // host 문자열 포함 여부가 아니라 파싱된 호스트로 비교합니다.
    // (substring 비교는 startaxltd.com.attacker.io 같은 도메인을 통과시킵니다.)
    return new URL(origin).host !== request.nextUrl.host;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (UNSAFE_METHODS.has(request.method) && isCrossOrigin(request)) {
    return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 });
  }

  if (RATE_LIMITED_PATHS.has(pathname) && request.method === 'POST') {
    // 경로별로 카운트를 분리합니다. 상담 신청을 여러 번 한 사용자가
    // 관리자 로그인까지 막히면 안 되므로.
    const key = `${pathname}:${getClientIp(request)}`;
    const now = Date.now();
    const entry = rateLimit.get(key);

    if (entry && now < entry.resetTime) {
      if (entry.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      rateLimit.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Clean up old entries periodically
    if (rateLimit.size > 1000) {
      for (const [mapKey, val] of rateLimit) {
        if (now > val.resetTime) rateLimit.delete(mapKey);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
