import { VALUES } from '@/lib/content';

export default function Values() {
  return (
    <div className="values-shell">
      <div className="values">
        <div className="center reveal">
          <span className="kicker">런치핏이 줄여드리는 것</span>
          <h2>
            점심 고민은 덜고,
            <br />
            점심시간은 온전히
          </h2>
          <p className="lead">메뉴 찾기는 저희가 할게요. 점심시간엔 쉬기만 하세요.</p>
        </div>
        <div className="value-list">
          {VALUES.map((v) => (
            <div key={v.title} className="value reveal">
              <div className="big">
                {v.big}
                <small>{v.unit}</small>
              </div>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
