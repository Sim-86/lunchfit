// 서버 전용 Supabase 클라이언트. secret 키를 쓰므로 절대 클라이언트 컴포넌트에서 import하지 마세요.
import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL / SUPABASE_SECRET_KEY 가 .env.local 에 설정되어 있지 않습니다.');
  }
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
