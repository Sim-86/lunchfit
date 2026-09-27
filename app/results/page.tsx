import type { Metadata } from 'next';
import Results from '@/components/Results';
import { ToastProvider } from '@/components/Toast';
import { getApplication } from '@/lib/applications';

export const metadata: Metadata = {
  title: '신청 완료 | 런치핏',
  robots: { index: false, follow: false },
};

// 신청자별 응답을 매 요청마다 DB에서 읽음
export const dynamic = 'force-dynamic';

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { responseId } = await searchParams;
  const id = typeof responseId === 'string' ? responseId : '';

  let app = null;
  let failed = false;
  if (id) {
    try {
      app = await getApplication(id);
    } catch (err) {
      console.error('[LunchFit] 신청 조회 실패:', err);
      failed = true;
    }
  }

  return (
    <ToastProvider>
      <Results app={app} failed={failed} />
    </ToastProvider>
  );
}
