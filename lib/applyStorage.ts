// 작성 중인 신청 답변(draft)을 브라우저 sessionStorage에 임시 저장합니다.
// 제출된 최종 응답은 Supabase에 저장됩니다 (lib/applications.ts).
import type { Answers } from './applySteps';

const DRAFT_KEY = 'lunchfit:apply-draft';

export type Draft = { step: number; answers: Answers };

function read<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장이 막힌 환경(시크릿 모드 등)에서는 조용히 무시
  }
}

function remove(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {}
}

export const loadDraft = () => read<Draft>(DRAFT_KEY);
export const saveDraft = (draft: Draft) => write(DRAFT_KEY, draft);
export const clearDraft = () => remove(DRAFT_KEY);
