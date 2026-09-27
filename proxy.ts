import { NextResponse, type NextRequest } from 'next/server';
import { checkDashboardAuth } from '@/lib/dashboardAuth';

// /dashboard 는 신청자 개인정보가 보이므로 Basic Auth로 보호합니다.
export function proxy(request: NextRequest) {
  const result = checkDashboardAuth(request.headers.get('authorization'));
  if (result === 'ok') return NextResponse.next();

  if (result === 'not_configured') {
    return new NextResponse('DASHBOARD_PASSWORD 가 설정되지 않아 대시보드를 열 수 없습니다. .env.local 을 확인하세요.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return new NextResponse('인증이 필요합니다.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="LunchFit Dashboard", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
