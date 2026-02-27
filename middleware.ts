import { NextRequest, NextResponse } from 'next/server';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/api/send-email' && request.method === 'POST') {
    const ip = getClientIp(request);
    const now = Date.now();
    const entry = rateLimit.get(ip);

    if (entry && now < entry.resetTime) {
      if (entry.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Clean up old entries periodically
    if (rateLimit.size > 1000) {
      for (const [key, val] of rateLimit) {
        if (now > val.resetTime) rateLimit.delete(key);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
