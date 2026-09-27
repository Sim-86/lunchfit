# 런치핏 캠페인 페이지

런치핏 4주 파일럿 사전 신청 랜딩(`lunchfit-landing.html`)을 Next.js(App Router, TypeScript)로 옮긴 프로젝트입니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # 프로덕션
```

## 구조

```
app/
  layout.tsx          폰트(Hahmlet·Pretendard), 메타데이터
  page.tsx            섹션 조립
  globals.css         원본 스타일 그대로
  apply/page.tsx      사전 신청 멀티스텝 폼 (/apply)
  results/page.tsx    신청자별 결과 (/results?responseId=<uuid>, DB에서 1건 조회)
  dashboard/page.tsx  전체 신청 대시보드 (/dashboard, Basic Auth)
  api/apply/route.ts  신청 검증 후 Supabase 저장 → { id } 반환
proxy.ts              /dashboard 비밀번호 보호
components/
  Hero.tsx            히어로 + 메뉴 타일 인터랙션 (client)
  Problems.tsx        고민 3카드
  HowItWorks.tsx      이용 방법 4단계
  Values.tsx          런치핏이 줄여드리는 것
  TeamBenefit.tsx     팀 신청 혜택
  PilotInfo.tsx       파일럿 안내
  Countdown.tsx       이벤트 마감 카운트다운 (client)
  ApplyCta.tsx        메인 하단 신청 유도 섹션
  ApplyFlow.tsx       한 화면 한 질문 멀티스텝 폼 (client)
  Results.tsx         신청 결과 · 추천 · 쿠폰 (client)
  Footer.tsx
  MobileCta.tsx       모바일 하단 고정 CTA (client)
  InviteButton.tsx    초대 링크 복사 (client)
  Toast.tsx           토스트 컨텍스트 (client)
  RevealObserver.tsx  스크롤 등장 효과 (client)
lib/
  content.ts          카피·메뉴·옵션 데이터 (문구 수정은 여기서)
  application.ts      신청 데이터 타입, 검증, 전화번호 포맷
  applySteps.ts       멀티스텝 폼 단계 정의 (순서·문구)
  applyStorage.ts     작성 중 답변(draft) sessionStorage 임시 저장
  supabase.ts         서버 전용 Supabase 클라이언트 (secret 키)
  applications.ts     applications 테이블 저장·조회
  dashboardStats.ts   대시보드 집계
  dashboardAuth.ts    대시보드 Basic Auth 검사
supabase/migrations/  DB 스키마 (applications 테이블, RLS)
  recommend.ts        응답 기반 메뉴 추천
```

## 신청 데이터 저장 (Supabase)

1. `supabase/migrations/`의 SQL로 `applications` 테이블을 만듭니다 (RLS 켜짐, 공개 정책 없음 → 서버에서만 접근).
2. `.env.example`을 `.env.local`로 복사해 `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `DASHBOARD_PASSWORD`를 채웁니다.
3. 흐름: `/apply` 제출 → `POST /api/apply`(검증·저장) → `/results?responseId=<id>` → 서버에서 그 1건만 조회해 표시.
4. `/dashboard`: 브라우저 로그인 창에 `DASHBOARD_USER`(기본 admin) / `DASHBOARD_PASSWORD` 입력. 비밀번호가 비어 있으면 열리지 않습니다.
