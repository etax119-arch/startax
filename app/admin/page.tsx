import { redirect } from 'next/navigation';

/**
 * 로그인 여부는 /admin/login 이 판단합니다 (이미 인증된 방문자는 거기서
 * /admin/columns 로 보냅니다). "관리자가 어디에 도착하는가"라는 규칙이
 * 한 곳에만 있도록 여기서는 항상 로그인으로 넘깁니다.
 */
export default function AdminIndexPage() {
  redirect('/admin/login');
}
