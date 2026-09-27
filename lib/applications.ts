// applications 테이블 읽기·쓰기 (서버 전용)
import 'server-only';
import type { Application } from './application';
import { getSupabase } from './supabase';

const TABLE = 'applications';
const COLUMNS = 'id, created_at, name, phone, area, menu, price, team, allergy, agree, ref';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  area: string;
  menu: string[];
  price: string;
  team: string;
  allergy: string;
  agree: boolean;
  ref: string;
};

export type StoredApplication = Application & { id: string };

const fromRow = (r: Row): StoredApplication => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  area: r.area,
  menu: r.menu ?? [],
  price: r.price,
  team: r.team,
  allergy: r.allergy ?? '',
  agree: r.agree,
  ref: r.ref ?? '',
  submittedAt: r.created_at,
});

export const isResponseId = (id: unknown): id is string => typeof id === 'string' && UUID_RE.test(id);

export async function insertApplication(app: Application): Promise<string> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert({
      name: app.name,
      phone: app.phone,
      area: app.area,
      menu: app.menu,
      price: app.price,
      team: app.team,
      allergy: app.allergy,
      agree: app.agree,
      ref: app.ref,
    })
    .select('id')
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function getApplication(id: string): Promise<StoredApplication | null> {
  if (!isResponseId(id)) return null;
  const { data, error } = await getSupabase().from(TABLE).select(COLUMNS).eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as Row) : null;
}

/** 전체 신청 (최신순). 파일럿 규모(수천 건 이하)를 가정해 한 번에 읽습니다. */
export async function listApplications(): Promise<StoredApplication[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select(COLUMNS)
    .order('created_at', { ascending: false })
    .limit(5000);
  if (error) throw error;
  return (data as Row[]).map(fromRow);
}
