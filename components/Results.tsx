import Link from 'next/link';
import { maskPhone, type Application } from '@/lib/application';
import { FORM_OPTIONS, SITE } from '@/lib/content';
import { recommendMenus } from '@/lib/recommend';
import InviteButton from './InviteButton';

const labelOf = (key: keyof typeof FORM_OPTIONS, value: string) =>
  FORM_OPTIONS[key].find((o) => o.value === value)?.label ?? value;

// 서버(app/results/page.tsx)에서 responseId로 조회한 신청 1건을 보여줍니다.
export default function Results({ app, failed = false }: { app: Application | null; failed?: boolean }) {
  if (!app) {
    return (
      <div className="results">
        <div className="results-empty">
          <div className="big-emoji">{failed ? '😢' : '🍱'}</div>
          <h1>{failed ? '신청 정보를 불러오지 못했어요' : '신청 정보가 없어요'}</h1>
          <p>
            {failed
              ? '잠시 후 이 페이지를 새로고침해 주세요.'
              : '링크가 올바른지 확인해 주세요. 사전 신청을 마치면 맞춤 추천과 할인 쿠폰을 보여드릴게요.'}
          </p>
          <Link href="/apply" className="btn">
            {SITE.ctaLabel} <span className="arr">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const picks = recommendMenus(app);
  const summary = [
    { label: '근무 지역', value: labelOf('area', app.area) },
    { label: '좋아하는 메뉴', value: app.menu.map((m) => labelOf('menu', m)).join(', ') },
    { label: '한 끼 가격', value: labelOf('price', app.price) },
    { label: '함께 먹는 사람', value: labelOf('team', app.team) },
    { label: '빼고 싶은 재료', value: app.allergy || '없음' },
    { label: '쿠폰 받을 번호', value: maskPhone(app.phone) },
  ];

  return (
    <div className="results">
      <section className="results-hero">
        <div className="big-emoji">🎉</div>
        <h1>{app.name}님, 신청 완료!</h1>
        <p>
          점심 고민, 이제 런치핏이 덜어드릴게요.
          <br />
          파일럿이 시작되면 가장 먼저 연락드릴게요.
        </p>
        <div className="coupon">{SITE.couponLabel}</div>
        <p className="results-note">쿠폰은 입력하신 번호로 문자 발송돼요.</p>
      </section>

      <section className="results-block">
        <span className="kicker">맞춤 추천</span>
        <h2>이번 주 {app.name}님 추천 점심</h2>
        <div className="results-picks">
          {picks.map((m) => (
            <div key={m.name} className="results-pick">
              <div className="icon-tile">{m.emoji}</div>
              <span>{m.cat}</span>
              <b>{m.name}</b>
              <p>{m.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="results-block">
        <span className="kicker">내 응답</span>
        <dl className="results-summary">
          {summary.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {app.team !== '개인' && (
        <section className="results-block results-team">
          <p>
            <b>팀원 5명이 모이면 배송비 0원!</b> 동료를 초대해 보세요.
          </p>
          <InviteButton className="btn" />
        </section>
      )}

      <div className="results-home">
        <Link href="/">메인으로 돌아가기</Link>
      </div>
    </div>
  );
}
