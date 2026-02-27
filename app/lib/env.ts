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
