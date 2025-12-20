"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LoaderContext = createContext<boolean>(true);

export function PageLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadImages: string[] = [];

    // Detect which background image applies
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    preloadImages.push(
      isDesktop
        ? "/assets/img/background_image.png"
        : "/assets/img/background_image2.png"
    );

    // Collect all <img> elements
    const imgElements = Array.from(document.images);
    const totalAssets = preloadImages.length + imgElements.length;

    if (totalAssets === 0) {
      setLoading(false);
      return;
    }

    let loaded = 0;

    const onAssetLoad = () => {
      loaded++;
      if (loaded === totalAssets) {
        setLoading(false);
      }
    };

    // Preload background images
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = onAssetLoad;
      img.onerror = onAssetLoad;
    });

    // Track <img> tags
    imgElements.forEach((img) => {
      if (img.complete) {
        onAssetLoad();
      } else {
        img.addEventListener("load", onAssetLoad);
        img.addEventListener("error", onAssetLoad);
      }
    });

    return () => {
      imgElements.forEach((img) => {
        img.removeEventListener("load", onAssetLoad);
        img.removeEventListener("error", onAssetLoad);
      });
    };
  }, []);

  return (
    <LoaderContext.Provider value={loading}>{children}</LoaderContext.Provider>
  );
}

export function usePageLoading() {
  return useContext(LoaderContext);
}
