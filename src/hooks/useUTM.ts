import { useEffect } from "react";

export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

export const getUTMParams = (): UTMParams => {
  const stored = sessionStorage.getItem("utm_params");
  if (stored) return JSON.parse(stored);
  return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null };
};

export const useUTM = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
    const hasUTM = keys.some((k) => params.get(k));
    if (hasUTM) {
      const utm: UTMParams = {
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        utm_content: params.get("utm_content"),
        utm_term: params.get("utm_term"),
      };
      sessionStorage.setItem("utm_params", JSON.stringify(utm));
    }
  }, []);

  return getUTMParams();
};
