import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import DailyChart from '@/components/dashboard/DailyChart';
import HBarChart from '@/components/dashboard/HBarChart';
import { maskPhone } from '@/lib/application';
import { listApplications, type StoredApplication } from '@/lib/applications';
import { FORM_OPTIONS } from '@/lib/content';
import { checkDashboardAuth } from '@/lib/dashboardAuth';
import { buildDashboardStats, PILOT_GOALS } from '@/lib/dashboardStats';
import './dashboard.css';

export const metadata: Metadata = {
  title: '사전 신청 대시보드 | 런치핏',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const RECENT_LIMIT = 50;
const pct = (v: number) => `${Math.round(v * 100)}%`;
const labelOf = (key: keyof typeof FORM_OPTIONS, value: string) =>
  FORM_OPTIONS[key].find((o) => o.value === value)?.label ?? value;
const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));

export default async function DashboardPage() {
  // proxy.ts 에서 1차로 막지만, 페이지에서도 한 번 더 확인
  if (checkDashboardAuth((await headers()).get('authorization')) !== 'ok') notFound();

  let apps: StoredApplication[] = [];
  let failed = false;
  try {
    apps = await listApplications();
  } catch (err) {
    console.error('[LunchFit] 대시보드 조회 실패:', err);
    failed = true;
  }

  const s = buildDashboardStats(apps);
  const updatedAt = fmtTime(new Date().toISOString());

  return (
    <div className="dash">
      <header className="dash-top">
        <div>
          <Link href="/" className="logo">
            런치핏<small>LUNCHFIT</small>
          </Link>
          <h1>사전 신청 대시보드</h1>
        </div>
        <div className="dash-updated">
          <span>{updatedAt} 기준 (한국 시간)</span>
          <a href="/dashboard" className="btn btn-line">
            새로고침
          </a>
        </div>
      </header>

      {failed && (
        <p className="dash-alert" role="alert">
          ⚠️ 데이터를 불러오지 못했어요. Supabase 연결 설정(.env.local)을 확인해 주세요.
        </p>
      )}

      <section className="dash-kpis">
        <div className="kpi">
          <span>총 신청자</span>
          <b>
            {s.total.toLocaleString()}
            <small>명</small>
          </b>
          <div className="kpi-meter" aria-hidden="true">
            <i style={{ width: `${Math.min(100, s.goalRate * 100)}%` }} />
          </div>
          <p>
            목표 {PILOT_GOALS.applicants}명 중 {pct(s.goalRate)}
          </p>
        </div>
        <div className="kpi">
          <span>오늘 신청</span>
          <b>
            {s.todayCount.toLocaleString()}
            <small>명</small>
          </b>
          <p>자정(한국 시간) 기준</p>
        </div>
        <div className="kpi">
          <span>팀 주문 관심</span>
          <b>{pct(s.teamShare)}</b>
          <div className="kpi-meter" aria-hidden="true">
            <i style={{ width: `${Math.min(100, s.teamShare * 100)}%` }} />
            <em style={{ left: `${PILOT_GOALS.teamShare * 100}%` }} />
          </div>
          <p>
            {s.teamShare >= PILOT_GOALS.teamShare ? '✓ 목표 달성' : '목표 미달'} · 목표 {pct(PILOT_GOALS.teamShare)}
          </p>
        </div>
        <div className="kpi">
          <span>5명 이상 팀</span>
          <b>
            {s.teamFiveCount.toLocaleString()}
            <small>명</small>
          </b>
          <p>무료배송 대상 신청자</p>
        </div>
      </section>

      {s.total === 0 && !failed ? (
        <section className="dash-card dash-empty">
          <div className="big-emoji">🍱</div>
          <h2>아직 신청이 없어요</h2>
          <p>
            <Link href="/apply">사전 신청 페이지</Link>에서 첫 응답이 들어오면 여기에 차트가 나타나요.
          </p>
        </section>
      ) : (
        <>
          <section className="dash-card">
            <div className="dash-card-head">
              <h2>일별 신청 추이</h2>
              <span>최근 {s.days.length}일 · 막대에 마우스를 올리면 누적 인원</span>
            </div>
            <DailyChart days={s.days} />
          </section>

          <div className="dash-grid">
            <section className="dash-card">
              <div className="dash-card-head">
                <h2>근무 지역</h2>
                <span>파일럿 첫 지역 결정용</span>
              </div>
              <HBarChart bars={s.area} />
            </section>
            <section className="dash-card">
              <div className="dash-card-head">
                <h2>함께 먹는 사람</h2>
                <span>팀 주문 수요</span>
              </div>
              <HBarChart bars={s.team} />
            </section>
            <section className="dash-card">
              <div className="dash-card-head">
                <h2>좋아하는 메뉴</h2>
                <span>복수 선택 · 응답자 대비 비율</span>
              </div>
              <HBarChart bars={s.menu} unit="명 선택" shareLabel="응답자의" />
            </section>
            <section className="dash-card">
              <div className="dash-card-head">
                <h2>한 끼 희망 가격</h2>
                <span>테스트 가격 9,000~12,000원</span>
              </div>
              <HBarChart bars={s.price} />
              <div className="dash-subhead">
                <h3>유입 경로</h3>
                <span>빼고 싶은 재료를 적은 신청자 {s.allergyCount}명</span>
              </div>
              <HBarChart bars={s.ref} />
            </section>
          </div>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2>최근 신청</h2>
              <span>
                최신 {Math.min(RECENT_LIMIT, s.total)}건 / 전체 {s.total}건 · 전화번호는 가려서 표시
              </span>
            </div>
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>신청 시각</th>
                    <th>이름</th>
                    <th>연락처</th>
                    <th>지역</th>
                    <th>좋아하는 메뉴</th>
                    <th>가격</th>
                    <th>함께</th>
                    <th>빼고 싶은 재료</th>
                    <th>결과</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.slice(0, RECENT_LIMIT).map((a) => (
                    <tr key={a.id}>
                      <td className="nowrap">{fmtTime(a.submittedAt)}</td>
                      <td className="nowrap">{a.name}</td>
                      <td className="nowrap">{maskPhone(a.phone)}</td>
                      <td className="nowrap">{labelOf('area', a.area)}</td>
                      <td>{a.menu.map((m) => labelOf('menu', m)).join(', ')}</td>
                      <td className="nowrap">{labelOf('price', a.price)}</td>
                      <td className="nowrap">{labelOf('team', a.team)}</td>
                      <td>{a.allergy || '-'}</td>
                      <td className="nowrap">
                        <a href={`/results?responseId=${a.id}`} target="_blank" rel="noreferrer">
                          보기
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
