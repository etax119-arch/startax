import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from './session';

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * /api/admin/* 의 모든 핸들러(login 제외) 최상단에서 호출합니다.
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 *
 * 반환값이 null 이면 인가된 요청입니다.
 * 교차 출처 차단은 middleware.ts 가 /api/* 전체에 대해 처리하므로 여기서는
 * 인증만 봅니다. 쿠키가 sameSite: 'lax' 인 것도 같은 방향의 방어입니다.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }
  return null;
}
