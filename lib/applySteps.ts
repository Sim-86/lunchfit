// /apply 멀티스텝 폼의 단계 정의. 순서를 바꾸거나 문구를 고치려면 이 배열만 수정하면 됩니다.
import { FORM_OPTIONS } from './content';

export type Answers = {
  area: string;
  menu: string[];
  price: string;
  team: string;
  allergy: string;
  name: string;
  phone: string;
  agree: boolean;
};

export const EMPTY_ANSWERS: Answers = {
  area: '',
  menu: [],
  price: '',
  team: '',
  allergy: '',
  name: '',
  phone: '',
  agree: false,
};

type Option = { value: string; label: string };

export type Step =
  | { key: 'area' | 'price' | 'team'; kind: 'single'; title: string; subtitle?: string; options: Option[] }
  | { key: 'menu'; kind: 'multi'; title: string; subtitle?: string; options: Option[] }
  | { key: 'allergy'; kind: 'text'; title: string; subtitle?: string; placeholder: string }
  | { key: 'contact'; kind: 'contact'; title: string; subtitle?: string };

export const APPLY_STEPS: Step[] = [
  {
    key: 'area',
    kind: 'single',
    title: '회사가 어디에 있나요?',
    subtitle: '신청이 가장 많은 지역에서 파일럿을 먼저 시작해요.',
    options: FORM_OPTIONS.area,
  },
  {
    key: 'menu',
    kind: 'multi',
    title: '어떤 점심을 좋아하세요?',
    subtitle: '여러 개 골라도 좋아요. 추천에 반영해 드릴게요.',
    options: FORM_OPTIONS.menu,
  },
  {
    key: 'price',
    kind: 'single',
    title: '한 끼에 얼마 정도가 적당한가요?',
    options: FORM_OPTIONS.price,
  },
  {
    key: 'team',
    kind: 'single',
    title: '팀 주문에 관심 있으신가요?',
    subtitle: '같은 회사 5명이 모이면 파일럿 기간 배송비가 0원이에요.',
    options: FORM_OPTIONS.team,
  },
  {
    key: 'allergy',
    kind: 'text',
    title: '빼고 싶은 재료가 있나요?',
    subtitle: '알레르기나 싫어하는 재료를 알려주시면 추천에서 빼 드릴게요.',
    placeholder: '예: 갑각류 알레르기, 오이 싫어요',
  },
  {
    key: 'contact',
    kind: 'contact',
    title: '쿠폰 받을 연락처를 알려주세요',
    subtitle: '첫 주문 20% 할인 쿠폰을 문자로 보내드려요.',
  },
];
