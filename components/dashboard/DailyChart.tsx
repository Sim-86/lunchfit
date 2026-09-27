import type { Day } from '@/lib/dashboardStats';

/** 일별 신청 수 세로 막대. 누적은 두 번째 축 대신 툴팁과 표로 제공합니다. */
export default function DailyChart({ days }: { days: Day[] }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  const ticks = [max, Math.round(max / 2), 0].filter((v, i, a) => a.indexOf(v) === i);
  return (
    <div className="daily">
      <div className="daily-plot">
        <div className="daily-grid" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} style={{ bottom: `${(t / max) * 100}%` }}>
              <em>{t}</em>
            </span>
          ))}
        </div>
        <ol className="daily-bars">
          {days.map((d, i) => (
            <li key={d.date} tabIndex={0} aria-label={`${d.label} ${d.count}명, 누적 ${d.cumulative}명`}>
              <i style={{ height: d.count ? `${Math.max(2, (d.count / max) * 100)}%` : 0 }} />
              <span className={`daily-x${i % 3 === 0 || i === days.length - 1 ? '' : ' minor'}`}>{d.label}</span>
              <span className="dash-tip" role="tooltip">
                <b>{d.date}</b>
                신청 {d.count}명 · 누적 {d.cumulative}명
              </span>
            </li>
          ))}
        </ol>
      </div>
      <details className="dash-table-toggle">
        <summary>표로 보기</summary>
        <table className="dash-table compact">
          <thead>
            <tr>
              <th>날짜</th>
              <th>신청</th>
              <th>누적</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date}>
                <td>{d.date}</td>
                <td>{d.count}</td>
                <td>{d.cumulative}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
