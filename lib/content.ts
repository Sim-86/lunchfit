// 페이지에 들어가는 카피와 데이터를 한 곳에서 관리합니다.
// 캠페인별 문구 수정은 이 파일만 고치면 됩니다.

export const SITE = {
  title: '런치핏 사전 신청',
  description: '점심 고민을 줄이면, 하루가 조금 더 가벼워집니다. 직장인 점심 구독 런치핏 4주 파일럿 사전 신청.',
  ctaLabel: '내 점심 고민 끝내기',
  couponLabel: '첫 주문 20% 할인',
};

// 사전 신청 이벤트 마감 (한국 시간 기준)
export const EVENT = {
  endsAt: '2026-09-30T23:59:59+09:00',
  endLabel: '9월 30일(수) 23:59 마감',
};

export const NAV = [
  { href: '#problem', label: '고민' },
  { href: '#how', label: '이용 방법' },
  { href: '#team', label: '팀 혜택' },
  { href: '#pilot', label: '파일럿' },
  { href: '/apply', label: '사전 신청', dark: true },
];

export type Menu = {
  emoji: string;
  cat: string;
  name: string;
  price: string;
  /** 매칭되는 신청 폼 '좋아하는 메뉴' 값 (추천에 사용) */
  styles: string[];
  /** 데스크톱 타일 위치(%) */
  x: number;
  y: number;
  /** 타일 회전 각도(deg) */
  r: number;
  /** 모바일 타일 위치(%) */
  mx: number;
  my: number;
};

// 배열 순서 = 화면 왼쪽→오른쪽 순서 = 자동 전환 순서
export const MENUS: Menu[] = [
  { emoji: '🌶️', cat: '얼얼한 마라',  name: '마라탕 (맵기 선택)',      price: '10,500원', styles: ['마라탕'], x: 9,  y: 84, r: -20, mx: 7.5, my: 40 },
  { emoji: '🍜', cat: '면·국물',     name: '차돌 쌀국수',            price: '9,800원',  styles: ['면·국물'], x: 10, y: 54, r: -14, mx: 19, my: 23 },
  { emoji: '🥗', cat: '샐러드·포케', name: '연어 포케 볼',           price: '11,900원', styles: ['샐러드·포케', '저당·가벼운 식단'], x: 19, y: 31, r: -9,  mx: 31, my: 11 },
  { emoji: '🍚', cat: '든든한 한식', name: '제육 쌈밥 정식',         price: '10,500원', styles: ['든든한 한식'], x: 31, y: 16, r: -4,  mx: 43.5, my: 5 },
  { emoji: '🍗', cat: '고단백',      name: '닭가슴살 스테이크 도시락', price: '10,900원', styles: ['고단백', '저당·가벼운 식단'], x: 69, y: 16, r: 4,   mx: 56.5, my: 5 },
  { emoji: '🍣', cat: '일식',        name: '모둠 초밥 세트',         price: '11,500원', styles: ['일식'], x: 81, y: 31, r: 9,   mx: 69, my: 11 },
  { emoji: '🍝', cat: '양식',        name: '버섯 크림 리조또',       price: '10,800원', styles: ['양식'], x: 90, y: 54, r: 14,  mx: 81, my: 23 },
  { emoji: '🍟', cat: '바삭한 튀김',  name: '감자튀김 & 치킨텐더 세트', price: '9,500원',  styles: ['감자튀김'], x: 91, y: 84, r: 20,  mx: 92.5, my: 40 },
];
export const DEFAULT_MENU_INDEX = 3;

export const HERO_META = ['신청 1분', '결제 정보 필요 없음', '강남 · 판교 · 을지로 중 1곳에서 시작'];

export const PROBLEMS = [
  {
    icon: '⏰',
    time: '오전 11:48',
    quote: '"다들 뭐 먹을래요?"',
    title: '메뉴 고르다 점심시간이 줄어요',
    body: '검색하고, 배달앱 뒤지고, 단톡방에서 의견 모으다 보면 벌써 12시 10분이에요.',
  },
  {
    icon: '🥲',
    time: '오후 12:05',
    quote: '"가볍게 먹으려 했는데…"',
    title: '원하는 메뉴는 찾기가 번거로워요',
    body: '가볍게 먹고 싶은 날에도 가격, 최소 주문 금액, 배달 가능 여부에 밀려 결국 늘 먹던 걸 시켜요.',
  },
  {
    icon: '🔁',
    time: '매주 수요일',
    quote: '"거기 또 가요?"',
    title: '회사 앞 메뉴는 이미 다 먹어봤어요',
    body: '근처 식당도 배달 메뉴도 거기서 거기예요. 새 메뉴를 찾아볼 여유도 없고요.',
  },
];

export const STEPS = [
  { icon: '📝', title: '취향 입력', body: '좋아하는 메뉴, 빼고 싶은 재료를 한 번만 알려주세요.' },
  { icon: '✨', title: '주간 추천', body: '매주 내 취향에 맞춘 메뉴 조합을 3~5개씩 추천해 드려요.' },
  { icon: '👆', title: '골라서 예약', body: '먹고 싶은 날짜와 메뉴만 톡톡 고르면 예약 끝.' },
  { icon: '🛵', title: '사무실 도착', body: '제휴 식당·도시락 브랜드의 메뉴가 정해진 시간에 도착해요.' },
];

export const VALUES = [
  { big: '10', unit: '초', title: '고르기만 하면 끝', body: '매일 검색할 필요 없어요. 추천 받은 메뉴 중에서 고르기만 하면 돼요.' },
  { big: '0', unit: '번', title: '싫어하는 메뉴는 추천 안 해요', body: '든든한 한식, 가벼운 샐러드, 고단백까지. 내 기준을 한 번 입력하면 추천에 계속 반영돼요.' },
  { big: '1', unit: '개 링크', title: '팀 점심도 링크 하나로', body: '링크를 공유하면 팀원이 각자 메뉴를 고르고, 주문은 한 번에 정리돼요.' },
];

export const TEAM_PERKS = ['파일럿 기간 무료 배송', '팀원 각자 메뉴 선택, 주문은 한 번에', '팀원 모두 첫 주문 20% 할인'];

export const PILOT = [
  { icon: '🗓️', label: '기간', value: '4주', body: '사전 신청 후 순차 안내' },
  { icon: '📍', label: '지역', value: '강남 · 판교 · 을지로', body: '신청이 가장 많은 1곳에서 먼저 시작해요' },
  { icon: '💳', label: '가격', value: '9,000~12,000원', body: '1회 기준 · 신청자는 첫 주문 20% 할인' },
  { icon: '🛵', label: '배송', value: '점심 2개 시간대', body: '늦지 않도록 시간대를 좁혀 운영해요' },
];

type Option = { value: string; label: string };

export const FORM_OPTIONS: Record<'area' | 'menu' | 'price' | 'team', Option[]> = {
  area: [
    { value: '강남', label: '강남' },
    { value: '판교', label: '판교' },
    { value: '을지로', label: '을지로' },
    { value: '기타', label: '그 외 지역' },
  ],
  menu: [
    { value: '든든한 한식', label: '🍚 든든한 한식' },
    { value: '면·국물', label: '🍜 면·국물' },
    { value: '마라탕', label: '🌶️ 마라탕' },
    { value: '샐러드·포케', label: '🥗 샐러드·포케' },
    { value: '고단백', label: '🍗 고단백' },
    { value: '저당·가벼운 식단', label: '🌿 저당·가벼운 식단' },
    { value: '양식', label: '🍝 양식' },
    { value: '감자튀김', label: '🍟 감자튀김' },
    { value: '일식', label: '🍣 일식' },
    { value: '아무거나 좋아요', label: '🤷 아무거나 좋아요' },
  ],
  price: [
    { value: '9천원대', label: '9천 원대' },
    { value: '1만~1.1만원', label: '1만~1.1만 원' },
    { value: '1.2만원', label: '1.2만 원' },
    { value: '상관없음', label: '맛있으면 상관없어요' },
  ],
  team: [
    { value: '개인', label: '혼자 먹어요' },
    { value: '팀 2~4명', label: '팀 2~4명' },
    { value: '팀 5명 이상', label: '팀 5명 이상 🚚 무료배송' },
  ],
};
