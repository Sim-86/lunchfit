// 신청 응답(좋아하는 스타일·가격대)으로 히어로 메뉴 중 이번 주 추천을 고릅니다.
import type { Application } from './application';
import { MENUS, type Menu } from './content';

// 가격대 응답 → 한 끼 최대 금액 (없으면 제한 없음)
const PRICE_MAX: Record<string, number> = {
  '9천원대': 9999,
  '1만~1.1만원': 11000,
  '1.2만원': 12000,
};

const toWon = (price: string) => Number(price.replace(/\D/g, ''));

export function recommendMenus(app: Pick<Application, 'menu' | 'price'>, count = 3): Menu[] {
  const anyStyle = app.menu.length === 0 || app.menu.includes('아무거나 좋아요');
  const max = PRICE_MAX[app.price] ?? Infinity;

  const styleMatch = (m: Menu) => anyStyle || m.styles.some((s) => app.menu.includes(s));
  const inBudget = (m: Menu) => toWon(m.price) <= max;

  // 점수: 스타일 일치(2) + 예산 안(1). 동점이면 원래 메뉴 순서 유지
  const score = (m: Menu) => (styleMatch(m) ? 2 : 0) + (inBudget(m) ? 1 : 0);
  return [...MENUS]
    .map((m, i) => ({ m, i, s: score(m) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, count)
    .map((x) => x.m);
}
