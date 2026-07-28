function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getResendApiKey(): string {
  return requireEnv('RESEND_API_KEY');
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM || 'onboarding@resend.dev';
}

export function getEmailTo(): string {
  return process.env.EMAIL_TO || 'etax119@hanmail.net';
}

// NEXT_PUBLIC_* 는 반드시 리터럴 프로퍼티 접근으로 읽어야 합니다.
// requireEnv 처럼 동적 키(process.env[key])로 접근하면 Next가 빌드 시점에
// 값을 인라인하지 못해 클라이언트 번들에서 undefined 가 됩니다.
export function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }
  return value;
}

export function getSupabaseAnonKey(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return value;
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY');
}

export function getAdminPassword(): string {
  return requireEnv('ADMIN_PASSWORD');
}

export function getAdminSessionSecret(): string {
  return requireEnv('ADMIN_SESSION_SECRET');
}
