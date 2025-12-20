"use client";

import { usePageLoading } from "./PageLoaderProvider";

export default function PageLoader() {
  const loading = usePageLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950">
      <div className="animate-pulse text-xl text-white font-semibold">
        Loading…
      </div>
    </div>
  );
}
