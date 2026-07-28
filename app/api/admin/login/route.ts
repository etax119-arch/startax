import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAdminPassword } from '../../../lib/env';
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  sha256Base64,
  timingSafeEqualStr,
} from '../../../lib/admin/session';

export async function POST(request: Request) {
  try {
    // 교차 출처 차단과 요청 빈도 제한은 middleware.ts 가 담당합니다.
    const body = await request.json();
    const password = body?.password;

    if (typeof password !== 'string' || !password) {
      return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // 다이제스트끼리 비교하면 길이가 항상 같아 타이밍 정보가 새지 않습니다.
    const [submitted, expected] = await Promise.all([
      sha256Base64(password),
      sha256Base64(getAdminPassword()),
    ]);

    if (!timingSafeEqualStr(submitted, expected)) {
      // 실패 사유를 구체적으로 알려주지 않습니다.
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, await createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
