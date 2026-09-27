'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { formatPhone, validateApplication, type Application, type FieldKey } from '@/lib/application';
import { APPLY_STEPS, EMPTY_ANSWERS, type Answers } from '@/lib/applySteps';
import { clearDraft, loadDraft, saveDraft } from '@/lib/applyStorage';

const TOTAL = APPLY_STEPS.length;
const AUTO_ADVANCE_MS = 250;

// 검증 오류 필드가 몇 번째 단계에 있는지 (연락처 필드는 마지막 단계)
const stepOfField = (key: FieldKey) => {
  const i = APPLY_STEPS.findIndex((s) => s.key === key);
  return i === -1 ? TOTAL - 1 : i;
};

export default function ApplyFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState<Set<FieldKey>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 작성 중이던 답변 복원
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setAnswers({ ...EMPTY_ANSWERS, ...draft.answers });
      setStep(Math.min(Math.max(draft.step, 0), TOTAL - 1));
    }
    setLoaded(true);
    return () => clearTimeout(autoTimer.current);
  }, []);

  useEffect(() => {
    if (loaded) saveDraft({ step, answers });
  }, [loaded, step, answers]);

  useEffect(() => {
    if (loaded) titleRef.current?.focus({ preventScroll: true });
  }, [loaded, step]);

  const current = APPLY_STEPS[step];
  const isLast = step === TOTAL - 1;

  function goTo(next: number) {
    clearTimeout(autoTimer.current);
    setDir(next > step ? 'next' : 'prev');
    setStep(next);
    window.scrollTo({ top: 0 });
  }

  function prev() {
    if (step === 0) router.push('/');
    else goTo(step - 1);
  }

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (errors.size) {
      const k = key as FieldKey;
      if (errors.has(k)) setErrors((e) => new Set([...e].filter((x) => x !== k)));
    }
  }

  function chooseSingle(key: 'area' | 'price' | 'team', value: string) {
    update(key, value);
    clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => goTo(step + 1), AUTO_ADVANCE_MS);
  }

  function toggleMulti(value: string) {
    // 연속 클릭에도 최신 상태 기준으로 토글되도록 함수형 업데이트 사용
    setAnswers((a) => ({
      ...a,
      menu: a.menu.includes(value) ? a.menu.filter((v) => v !== value) : [...a.menu, value],
    }));
  }

  async function submit() {
    if (submitting) return;
    const app: Application = {
      ...answers,
      name: answers.name.trim(),
      phone: answers.phone.trim(),
      allergy: answers.allergy.trim(),
      ref: new URLSearchParams(location.search).get('ref') || '',
      submittedAt: new Date().toISOString(),
    };
    const bad = validateApplication(app);
    if (bad.length) {
      setErrors(new Set(bad));
      const firstStep = Math.min(...bad.map(stepOfField));
      if (firstStep !== step) goTo(firstStep);
      return;
    }
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 422 && Array.isArray(json.errors) && json.errors.length) {
        const fields = json.errors as FieldKey[];
        setErrors(new Set(fields));
        const firstStep = Math.min(...fields.map(stepOfField));
        if (firstStep !== step) goTo(firstStep);
        setSubmitting(false);
        return;
      }
      if (!res.ok || !json.id) throw new Error(json.error || `HTTP ${res.status}`);
      clearDraft();
      router.push(`/results?responseId=${encodeURIComponent(json.id)}`);
    } catch {
      // 작성 중인 답변(draft)은 남겨 두어 바로 다시 시도할 수 있게 함
      setSubmitError(true);
      setSubmitting(false);
    }
  }

  function next() {
    if (isLast) submit();
    else goTo(step + 1);
  }

  const canNext = (() => {
    switch (current.kind) {
      case 'single':
        return !!answers[current.key];
      case 'multi':
        return answers.menu.length > 0;
      default:
        return true;
    }
  })();

  const nextLabel = isLast
    ? submitting
      ? '신청하는 중…'
      : '쿠폰 받기'
    : current.kind === 'text' && !answers.allergy.trim()
      ? '건너뛰기'
      : '다음';

  return (
    <div className="flow">
      <header className="flow-top">
        <Link href="/" className="logo">
          런치핏<small>LUNCHFIT</small>
        </Link>
        <span className="flow-count" aria-label={`전체 ${TOTAL}단계 중 ${step + 1}단계`}>
          <b>{step + 1}</b>/{TOTAL}
        </span>
      </header>
      <div className="flow-progress" aria-hidden="true">
        <i style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
      </div>

      <main className={`flow-body${loaded ? '' : ' loading'}`}>
        <div key={step} className={`flow-step ${dir}`}>
          <h1 ref={titleRef} tabIndex={-1}>
            {current.title}
          </h1>
          {current.subtitle && <p className="flow-sub">{current.subtitle}</p>}

          {current.kind === 'single' && (
            <div className="flow-options" role="radiogroup" aria-label={current.title}>
              {current.options.map((o) => {
                const on = answers[current.key] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className={`flow-option${on ? ' on' : ''}`}
                    onClick={() => chooseSingle(current.key, o.value)}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          )}

          {current.kind === 'multi' && (
            <div className="flow-options grid" role="group" aria-label={current.title}>
              {current.options.map((o) => {
                const on = answers.menu.includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={on}
                    className={`flow-option${on ? ' on' : ''}`}
                    onClick={() => toggleMulti(o.value)}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          )}

          {current.kind === 'text' && (
            <input
              type="text"
              className="flow-input"
              aria-label={current.title}
              placeholder={current.placeholder}
              value={answers.allergy}
              onChange={(e) => update('allergy', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && next()}
            />
          )}

          {current.kind === 'contact' && (
            <form
              className="flow-contact"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
            >
              <div className={`field${errors.has('name') ? ' invalid' : ''}`}>
                <label className="lbl" htmlFor="name">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  className="flow-input"
                  placeholder="홍길동"
                  autoComplete="name"
                  value={answers.name}
                  onChange={(e) => update('name', e.target.value)}
                />
                <div className="error">이름을 입력해 주세요.</div>
              </div>
              <div className={`field${errors.has('phone') ? ' invalid' : ''}`}>
                <label className="lbl" htmlFor="phone">
                  휴대폰 번호
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="flow-input"
                  placeholder="010-1234-5678"
                  autoComplete="tel"
                  inputMode="numeric"
                  value={answers.phone}
                  onChange={(e) => update('phone', formatPhone(e.target.value))}
                />
                <div className="error">휴대폰 번호를 정확히 입력해 주세요.</div>
              </div>
              <div className={`field${errors.has('agree') ? ' invalid' : ''}`}>
                <label className="agree">
                  <input type="checkbox" checked={answers.agree} onChange={(e) => update('agree', e.target.checked)} />
                  <span>
                    [필수] 파일럿 안내 및 쿠폰 발송을 위한 개인정보(이름, 휴대폰 번호) 수집·이용에 동의합니다. 수집한 정보는
                    파일럿 종료 후 3개월 안에 파기합니다.
                  </span>
                </label>
                <div className="error">개인정보 수집·이용에 동의해 주세요.</div>
              </div>
              {/* Enter 키 제출용 (화면에는 하단 버튼 사용) */}
              <button type="submit" hidden />
            </form>
          )}
        </div>
      </main>

      {submitError && (
        <p className="flow-submit-error" role="alert">
          저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      <div className="flow-nav">
        <button type="button" className="btn btn-line" onClick={prev}>
          이전
        </button>
        <button type="button" className="btn" onClick={next} disabled={!canNext || submitting}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
