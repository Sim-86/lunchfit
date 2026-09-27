import { NextResponse } from 'next/server';
import { formatPhone, validateApplication, type Application } from '@/lib/application';
import { insertApplication } from '@/lib/applications';
import { FORM_OPTIONS } from '@/lib/content';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const allowed = (key: keyof typeof FORM_OPTIONS, v: string) => FORM_OPTIONS[key].some((o) => o.value === v);

// 사전 신청 응답을 검증해 Supabase applications 테이블에 저장하고, 결과 페이지용 id를 돌려줍니다.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const menu = Array.isArray(body.menu)
    ? [...new Set(body.menu.filter((m): m is string => typeof m === 'string' && allowed('menu', m)))]
    : [];
  const area = str(body.area, 20);
  const price = str(body.price, 20);
  const team = str(body.team, 20);

  const data: Application = {
    name: str(body.name, 50),
    phone: formatPhone(str(body.phone, 20)),
    area: allowed('area', area) ? area : '',
    menu,
    price: allowed('price', price) ? price : '',
    team: allowed('team', team) ? team : '',
    allergy: str(body.allergy, 200),
    agree: body.agree === true,
    ref: str(body.ref, 50),
    submittedAt: new Date().toISOString(),
  };

  const errors = validateApplication(data);
  if (errors.length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const id = await insertApplication(data);
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error('[LunchFit] 신청 저장 실패:', err);
    return NextResponse.json({ ok: false, error: 'db_failed' }, { status: 500 });
  }
}
