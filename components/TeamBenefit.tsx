import { TEAM_PERKS } from '@/lib/content';
import InviteButton from './InviteButton';

export default function TeamBenefit() {
  return (
    <section className="team" id="team">
      <div className="wrap">
        <div className="team-box reveal">
          <div>
            <span className="kicker">팀 신청 혜택</span>
            <h2>
              같은 회사 5명이 모이면
              <br />
              배송비는 0원
            </h2>
            <p className="desc">
              동료에게 초대 링크를 보내주세요. 같은 회사에서 5명 이상 신청하면 파일럿 기간 동안 무료 배송 혜택을 드려요.
            </p>
            <ul className="team-perks">
              {TEAM_PERKS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="invite-card">
            <div className="people">
              <span>🙋‍♀️</span>
              <span>🙋</span>
              <span>🙋‍♂️</span>
              <span className="empty">+</span>
              <span className="empty">+</span>
            </div>
            <h3>5명까지 2명 남았어요!</h3>
            <p>예시 화면이에요. 신청하시면 우리 팀 현황을 볼 수 있어요.</p>
            <div className="progress">
              <i />
            </div>
            <small>3 / 5명 신청</small>
            <InviteButton />
          </div>
        </div>
      </div>
    </section>
  );
}
