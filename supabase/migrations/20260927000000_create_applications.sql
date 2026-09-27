-- 런치핏 4주 파일럿 사전 신청 응답
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 50),
  phone text not null check (phone ~ '^01[016789]-?[0-9]{3,4}-?[0-9]{4}$'),
  area text not null,
  menu text[] not null check (cardinality(menu) > 0),
  price text not null,
  team text not null,
  allergy text not null default '' check (char_length(allergy) <= 200),
  agree boolean not null check (agree),
  ref text not null default '' check (char_length(ref) <= 50)
);

comment on table public.applications is '런치핏 파일럿 사전 신청. Next 서버(secret 키)에서만 읽고 쓴다.';

-- RLS만 켜고 anon/authenticated 정책은 두지 않는다 → 브라우저에서 직접 접근 불가
alter table public.applications enable row level security;

create index applications_created_at_idx on public.applications (created_at desc);
