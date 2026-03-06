import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

const PixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Meta Pixel PageView
    if (window.fbq) window.fbq("track", "PageView");
    // Google Analytics
    if (window.gtag) window.gtag("event", "page_view", { page_path: location.pathname });
  }, [location.pathname]);

  return null;
};

export default PixelTracker;
