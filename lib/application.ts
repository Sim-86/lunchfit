// 사전 신청 데이터 타입과 검증 로직 (클라이언트·서버 공용)

export type Application = {
  name: string;
  phone: string;
  area: string;
  menu: string[];
  price: string;
  team: string;
  allergy: string;
  agree: boolean;
  ref: string;
  submittedAt: string;
};

export type FieldKey = 'name' | 'phone' | 'area' | 'menu' | 'price' | 'team' | 'agree';

// 검사 순서 = 화면 순서 (첫 번째 오류 필드로 스크롤할 때 사용)
export const FIELD_ORDER: FieldKey[] = ['name', 'phone', 'area', 'menu', 'price', 'team', 'agree'];

const PHONE_RE = /^01[016789]-?\d{3,4}-?\d{4}$/;

export function validateApplication(data: Application): FieldKey[] {
  const bad: Record<FieldKey, boolean> = {
    name: !data.name,
    phone: !PHONE_RE.test(data.phone),
    area: !data.area,
    menu: data.menu.length === 0,
    price: !data.price,
    team: !data.team,
    agree: !data.agree,
  };
  return FIELD_ORDER.filter((k) => bad[k]);
}

/** 화면 표시용 전화번호 마스킹: 010-1234-5678 → 010-****-5678 */
export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length < 8) return phone;
  return `${d.slice(0, 3)}-****-${d.slice(-4)}`;
}

/** 휴대폰 번호 자동 하이픈 */
export function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
}
