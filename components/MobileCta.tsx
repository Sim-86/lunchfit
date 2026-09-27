'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SITE } from '@/lib/content';

// 신청 섹션이 보이면 모바일 하단 고정 버튼을 숨깁니다.
export default function MobileCta() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const target = document.getElementById('apply');
    if (!target) return;
    const io = new IntersectionObserver(([en]) => setHide(en.isIntersecting), { threshold: 0.05 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`mobile-cta${hide ? ' hide' : ''}`}>
      <Link href="/apply" className="btn">
        {SITE.ctaLabel} <span className="arr">→</span>
      </Link>
    </div>
  );
}
