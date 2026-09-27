import type { Bar } from '@/lib/dashboardStats';

const pct = (v: number) => `${Math.round(v * 100)}%`;

/** 가로 막대 (단일 색). 값·비율은 막대 옆에 텍스트로 항상 표시하고, 호버 시 상세 툴팁. */
export default function HBarChart({
  bars,
  unit = '명',
  shareLabel = '전체 응답자 중',
}: {
  bars: Bar[];
  unit?: string;
  shareLabel?: string;
}) {
  const max = Math.max(1, ...bars.map((b) => b.count));
  return (
    <ul className="hbar">
      {bars.map((b) => (
        <li key={b.key} className="hbar-row" tabIndex={0}>
          <span className="hbar-label">{b.label}</span>
          <span className="hbar-track">
            <i style={{ width: b.count ? `${Math.max(1.5, (b.count / max) * 100)}%` : 0 }} />
          </span>
          <span className="hbar-value">
            <b>{b.count.toLocaleString()}</b>
            <small>{pct(b.share)}</small>
          </span>
          <span className="dash-tip" role="tooltip">
            <b>{b.label}</b>
            {b.count.toLocaleString()}
            {unit} · {shareLabel} {pct(b.share)}
          </span>
        </li>
      ))}
    </ul>
  );
}
