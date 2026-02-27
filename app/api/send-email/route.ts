import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { PHONE_REGEX, VALID_CATEGORIES, FIELD_LIMITS } from '../../lib/validation';
import { getResendApiKey, getEmailFrom, getEmailTo } from '../../lib/env';

const resend = new Resend(getResendApiKey());

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml(data: {
  name: string;
  company: string;
  phone: string;
  category: string;
  message: string;
}): string {
  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  return `
    <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #c8a96e; padding-bottom: 12px;">
        스타택스 상담 신청 안내
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 10px 12px; background: #f8f8f8; border: 1px solid #e0e0e0; font-weight: bold; width: 100px;">이름</td>
          <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; background: #f8f8f8; border: 1px solid #e0e0e0; font-weight: bold;">기업명</td>
          <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${escapeHtml(data.company || '-')}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; background: #f8f8f8; border: 1px solid #e0e0e0; font-weight: bold;">연락처</td>
          <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${escapeHtml(data.phone)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; background: #f8f8f8; border: 1px solid #e0e0e0; font-weight: bold;">문의분야</td>
          <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${escapeHtml(data.category)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; background: #f8f8f8; border: 1px solid #e0e0e0; font-weight: bold; vertical-align: top;">문의내용</td>
          <td style="padding: 10px 12px; border: 1px solid #e0e0e0; white-space: pre-wrap;">${escapeHtml(data.message)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; background: #f8f8f8; border: 1px solid #e0e0e0; font-weight: bold;">접수시간</td>
          <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${now}</td>
        </tr>
      </table>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    // Origin header check
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { error: '허용되지 않은 요청입니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, company, phone, category, message } = body;

    // Required fields check
    if (!name || !phone || !category || !message) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // Field length limits
    if (
      (typeof name === 'string' && name.length > FIELD_LIMITS.name) ||
      (typeof company === 'string' && company.length > FIELD_LIMITS.company) ||
      (typeof phone === 'string' && phone.length > FIELD_LIMITS.phone) ||
      (typeof category === 'string' && category.length > FIELD_LIMITS.category) ||
      (typeof message === 'string' && message.length > FIELD_LIMITS.message)
    ) {
      return NextResponse.json(
        { error: '입력값이 허용 길이를 초과했습니다.' },
        { status: 400 }
      );
    }

    // Phone format validation
    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { error: '올바른 전화번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // Category whitelist validation
    if (!VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
      return NextResponse.json(
        { error: '올바른 문의분야를 선택해주세요.' },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: getEmailTo(),
      subject: `[스타택스 상담신청] ${category} - ${name}님`,
      html: buildEmailHtml({ name, company, phone, category, message }),
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: '이메일 전송에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Send email error:', err);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
