'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((text: string) => {
    setMsg(text);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={`toast${show ? ' show' : ''}`}>{msg}</div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
