'use client';

import { useEffect, useState } from 'react';
import { EVENT } from '@/lib/content';

const END = new Date(EVENT.endsAt).getTime();

function getRemaining(now: number) {
  const total = Math.max(0, END - now);
  const s = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function Countdown() {
  // 서버 렌더와 클라이언트 시간이 달라 생기는 hydration 불일치를 피하려고 마운트 후에 계산
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const r = now === null ? null : getRemaining(now);
  const ended = r !== null && r.total === 0;

  const units = [
    { label: '일', value: r ? String(r.days) : '-' },
    { label: '시간', value: r ? pad(r.hours) : '--' },
    { label: '분', value: r ? pad(r.minutes) : '--' },
    { label: '초', value: r ? pad(r.seconds) : '--' },
  ];

  return (
    <section className="countdown" aria-label="사전 신청 마감까지 남은 시간">
      <div className="wrap">
        <div className="countdown-box">
          <div className="countdown-head">
            <span className="kicker">{ended ? '사전 신청 마감' : '사전 신청 마감까지'}</span>
            <p>
              {ended ? (
                '이번 사전 신청 이벤트는 종료되었어요.'
              ) : (
                <>
                  지금 신청하면 <b>첫 주문 20% 할인</b> · {EVENT.endLabel}
                </>
              )}
            </p>
          </div>
          <div className="countdown-timer" role="timer" aria-live="off">
            {units.map((u, i) => (
              <div key={u.label} className="countdown-unit">
                <b>{ended ? (i === 0 ? '0' : '00') : u.value}</b>
                <span>{u.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
