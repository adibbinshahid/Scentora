"use client";

import { useLayoutEffect } from "react";

export default function BannerHeightSync() {
  useLayoutEffect(() => {
    const banner = document.getElementById("demo-banner");
    if (!banner) return;

    const sync = () => {
      const h = banner.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--banner-h", `${h}px`);
      document.body.style.paddingTop = `${h}px`;
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(banner);
    return () => ro.disconnect();
  }, []);

  return null;
}
