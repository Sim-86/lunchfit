import { STEPS } from '@/lib/content';

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="wrap">
        <div className="center reveal">
          <span className="kicker">이용 방법</span>
          <h2>
            한 번 알려주시면,
            <br />
            매주 점심은 런치핏이 챙길게요
          </h2>
        </div>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={s.title} className="step reveal">
              <div className="icon-tile">
                {s.icon}
                <span className="num">{i + 1}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <p className="step-note reveal">
          파일럿 기간에는 <b>런치핏 팀이 신청 내용을 보고 직접 메뉴를 골라드려요.</b>
        </p>
      </div>
    </section>
  );
}
