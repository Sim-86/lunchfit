import type { Metadata } from 'next';
import ApplyFlow from '@/components/ApplyFlow';

export const metadata: Metadata = {
  title: '사전 신청 | 런치핏',
  description: '1분이면 신청 끝, 첫 주문 20% 할인 쿠폰까지. 런치핏 4주 파일럿 사전 신청.',
};

export default function ApplyPage() {
  return <ApplyFlow />;
}
