'use client';

import { useToast } from './Toast';

export default function InviteButton({ className = 'btn btn-line' }: { className?: string }) {
  const showToast = useToast();

  function copyInvite() {
    const url = `${location.origin}/apply?ref=team`;
    const done = () => showToast('초대 링크를 복사했어요. 팀 단톡방에 붙여넣어 보세요!');
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => showToast(url));
    else showToast(url);
  }

  return (
    <button type="button" className={className} onClick={copyInvite}>
      🔗 초대 링크 복사하기
    </button>
  );
}
