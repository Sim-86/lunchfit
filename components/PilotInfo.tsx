import { PILOT } from '@/lib/content';

export default function PilotInfo() {
  return (
    <section className="pilot" id="pilot">
      <div className="wrap">
        <div className="center reveal">
          <span className="kicker">파일럿 안내</span>
          <h2>4주 동안 먼저 경험해 보세요</h2>
          <p className="lead">정식 출시 전, 한 지역에서 소수 인원과 함께 먼저 시작해요.</p>
        </div>
        <div className="pilot-grid">
          {PILOT.map((p) => (
            <div key={p.label} className="pilot-item reveal">
              <div className="icon-tile">{p.icon}</div>
              <span>{p.label}</span>
              <b>{p.value}</b>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
