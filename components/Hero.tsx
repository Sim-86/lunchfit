'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_MENU_INDEX, HERO_META, MENUS, NAV, SITE } from '@/lib/content';

export default function Hero() {
  const [current, setCurrent] = useState(DEFAULT_MENU_INDEX); // 선택된 타일
  const [shown, setShown] = useState(DEFAULT_MENU_INDEX); // 접시에 보이는 메뉴
  const [swapping, setSwapping] = useState(false);
  const autoTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const swapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduceMotion = useRef(false);
  const currentRef = useRef(DEFAULT_MENU_INDEX);

  function select(i: number) {
    currentRef.current = i;
    setCurrent(i);
    setSwapping(true);
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => {
      setShown(i);
      setSwapping(false);
    }, reduceMotion.current ? 0 : 220);
  }

  function stopAuto() {
    clearInterval(autoTimer.current);
    autoTimer.current = undefined;
  }

  useEffect(() => {
    reduceMotion.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion.current) {
      autoTimer.current = setInterval(() => select((currentRef.current + 1) % MENUS.length), 2800);
    }
    return () => {
      stopAuto();
      clearTimeout(swapTimer.current);
    };
  }, []);

  const m = MENUS[shown];

  return (
    <div className="hero-shell">
      <header className="hero">
        <div className="topbar">
          <a href="#" className="logo">
            런치핏<small>LUNCHFIT</small>
          </a>
          <nav className="pillnav" aria-label="섹션 이동">
            {NAV.map((n) =>
              n.href.startsWith('/') ? (
                <Link key={n.href} href={n.href} className={n.dark ? 'dark' : undefined}>
                  {n.label}
                </Link>
              ) : (
                <a key={n.href} href={n.href} className={n.dark ? 'dark' : undefined}>
                  {n.label}
                </a>
              ),
            )}
          </nav>
          <Link href="/apply" className="btn">
            {SITE.ctaLabel}
          </Link>
        </div>

        <div className="stage">
          <div className="mound" />
          <div className="plate-wrap">
            <div className="plate">
              <div className={`dish${swapping ? ' swap' : ''}`}>{m.emoji}</div>
            </div>
            <div className="dish-name" style={{ opacity: swapping ? 0 : 1 }}>
              {m.cat}
            </div>
            <div className="order-tag">
              <span>
                {m.name} · <b>{m.price}</b>
              </span>
              <i>✓</i>
            </div>
          </div>
          <div className="stage-hint">메뉴 타일을 눌러보세요</div>

          {MENUS.map((menu, i) => (
            <button
              key={menu.cat}
              type="button"
              className={`tile${i === current ? ' on' : ''}`}
              style={
                {
                  '--x': `${menu.x}%`,
                  '--y': `${menu.y}%`,
                  '--r': `${menu.r}deg`,
                  '--mx': `${menu.mx}%`,
                  '--my': `${menu.my}%`,
                } as React.CSSProperties
              }
              aria-label={`${menu.cat} 추천 보기`}
              aria-pressed={i === current}
              onClick={() => {
                stopAuto();
                select(i);
              }}
            >
              <span>{menu.emoji}</span>
              <em>{menu.cat}</em>
            </button>
          ))}
        </div>

        <div className="hero-copy">
          <h1>
            점심 고민을 줄이면,
            <br />
            하루가 조금 더 가벼워집니다
          </h1>
          <p className="hero-sub">
            매주 내 취향에 맞춘 점심 추천부터 사무실 배송까지.
            <br />
            &quot;오늘 뭐 먹지?&quot;는 이제 10초면 끝나요.
          </p>
          <div className="hero-cta">
            <Link href="/apply" className="btn">
              {SITE.ctaLabel} <span className="arr">→</span>
            </Link>
            <span className="coupon-note">
              신청만 해도 <b>{SITE.couponLabel}</b>
            </span>
          </div>
          <div className="hero-meta">
            {HERO_META.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}
