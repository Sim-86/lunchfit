// 대시보드 집계 (순수 함수). 날짜는 한국 시간 기준으로 묶습니다.
import type { Application } from './application';
import { FORM_OPTIONS } from './content';

export const PILOT_GOALS = { applicants: 500, teamShare: 0.3 };
const DAILY_DAYS = 21;

export type Bar = { key: string; label: string; count: number; share: number };
export type Day = { date: string; label: string; count: number; cumulative: number };

const kstDate = (iso: string | Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    typeof iso === 'string' ? new Date(iso) : iso,
  );

const REF_LABELS: Record<string, string> = { '': '직접 방문', team: '팀 초대 링크' };

function optionBars(key: keyof typeof FORM_OPTIONS, values: string[], denominator: number): Bar[] {
  const counts = new Map<string, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  const bars: Bar[] = FORM_OPTIONS[key].map((o) => ({
    key: o.value,
    label: o.label,
    count: counts.get(o.value) ?? 0,
    share: denominator ? (counts.get(o.value) ?? 0) / denominator : 0,
  }));
  // 선택지에 없는 과거 값이 있으면 뒤에 붙임
  counts.forEach((count, v) => {
    if (!bars.some((b) => b.key === v)) bars.push({ key: v, label: v, count, share: denominator ? count / denominator : 0 });
  });
  return bars;
}

export function buildDashboardStats(apps: Application[], now = new Date()) {
  const total = apps.length;
  const today = kstDate(now);

  const todayCount = apps.filter((a) => kstDate(a.submittedAt) === today).length;
  const teamCount = apps.filter((a) => a.team !== '개인').length;
  const teamFiveCount = apps.filter((a) => a.team === '팀 5명 이상').length;
  const allergyCount = apps.filter((a) => a.allergy.trim()).length;

  // 일별 신청 (최근 DAILY_DAYS일)
  const perDay = new Map<string, number>();
  apps.forEach((a) => {
    const d = kstDate(a.submittedAt);
    perDay.set(d, (perDay.get(d) ?? 0) + 1);
  });
  const days: Day[] = [];
  const start = new Date(now.getTime() - (DAILY_DAYS - 1) * 86400000);
  const startKey = kstDate(start);
  let cumulative = apps.filter((a) => kstDate(a.submittedAt) < startKey).length;
  for (let i = 0; i < DAILY_DAYS; i++) {
    const date = kstDate(new Date(start.getTime() + i * 86400000));
    const count = perDay.get(date) ?? 0;
    cumulative += count;
    days.push({ date, label: `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`, count, cumulative });
  }

  // 선호 메뉴: 복수 선택이므로 응답자 수 대비 비율, 많은 순
  const menu = optionBars('menu', apps.flatMap((a) => a.menu), total).sort((a, b) => b.count - a.count);

  const refCounts = new Map<string, number>();
  apps.forEach((a) => refCounts.set(a.ref, (refCounts.get(a.ref) ?? 0) + 1));
  const ref: Bar[] = [...refCounts.entries()]
    .map(([k, count]) => ({ key: k || 'direct', label: REF_LABELS[k] ?? k, count, share: total ? count / total : 0 }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    todayCount,
    teamCount,
    teamShare: total ? teamCount / total : 0,
    teamFiveCount,
    allergyCount,
    goalRate: total / PILOT_GOALS.applicants,
    days,
    area: optionBars('area', apps.map((a) => a.area), total),
    menu,
    price: optionBars('price', apps.map((a) => a.price), total),
    team: optionBars('team', apps.map((a) => a.team), total),
    ref,
  };
}

export type DashboardStats = ReturnType<typeof buildDashboardStats>;
