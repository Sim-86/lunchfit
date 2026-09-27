import Link from 'next/link';
import { SITE } from '@/lib/content';

export default function ApplyCta() {
  return (
    <div className="apply-shell">
      <section className="apply" id="apply">
        <div className="wrap center">
          <span className="kicker">사전 신청</span>
          <h2>
            1분이면 신청 끝,
            <br />
            첫 주문 20% 할인 쿠폰까지
          </h2>
          <p className="lead">결제 정보는 필요 없어요. 파일럿이 시작되면 가장 먼저 연락드릴게요.</p>
          <div className="apply-cta">
            <Link href="/apply" className="btn">
              {SITE.ctaLabel} <span className="arr">→</span>
            </Link>
            <p>질문 6개 · 약 1분</p>
          </div>
        </div>
      </section>
    </div>
  );
}
