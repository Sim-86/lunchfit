import { PROBLEMS } from '@/lib/content';

export default function Problems() {
  return (
    <section id="problem">
      <div className="wrap">
        <div className="center reveal">
          <span className="kicker">혹시 오늘도?</span>
          <h2>
            점심은 매일 오는데,
            <br />
            고르는 건 매일 어렵죠
          </h2>
        </div>
        <div className="grid-3">
          {PROBLEMS.map((p) => (
            <div key={p.time} className="pcard reveal">
              <div className="icon-tile">{p.icon}</div>
              <div className="time">{p.time}</div>
              <div className="quote">{p.quote}</div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
