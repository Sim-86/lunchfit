// /dashboard Basic Auth 검사. proxy.ts와 대시보드 페이지 양쪽에서 사용합니다.

export type AuthResult = 'ok' | 'unauthorized' | 'not_configured';

// 길이·내용과 무관하게 같은 시간이 걸리도록 비교
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export function checkDashboardAuth(authorization: string | null): AuthResult {
  const user = process.env.DASHBOARD_USER || 'admin';
  const password = process.env.DASHBOARD_PASSWORD;
  // 비밀번호를 설정하지 않았으면 실수로 공개되지 않도록 아예 막음
  if (!password) return 'not_configured';
  if (!authorization?.startsWith('Basic ')) return 'unauthorized';

  let decoded = '';
  try {
    decoded = atob(authorization.slice(6).trim());
  } catch {
    return 'unauthorized';
  }
  const sep = decoded.indexOf(':');
  if (sep === -1) return 'unauthorized';
  const okUser = safeEqual(decoded.slice(0, sep), user);
  const okPass = safeEqual(decoded.slice(sep + 1), password);
  return okUser && okPass ? 'ok' : 'unauthorized';
}
