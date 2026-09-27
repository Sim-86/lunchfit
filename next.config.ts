import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 상위 폴더(C:\ClaudeWork)의 package-lock.json 때문에 루트를 잘못 추론하지 않도록 고정
  turbopack: { root: process.cwd() },
};

export default nextConfig;
