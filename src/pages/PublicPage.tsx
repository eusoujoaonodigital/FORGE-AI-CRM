import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HeroRenderer from "@/components/page-builder/sections/HeroRenderer";
import BenefitsRenderer from "@/components/page-builder/sections/BenefitsRenderer";
import PricingRenderer from "@/components/page-builder/sections/PricingRenderer";
import CTARenderer from "@/components/page-builder/sections/CTARenderer";
import TestimonialsRenderer from "@/components/page-builder/sections/TestimonialsRenderer";
import FAQRenderer from "@/components/page-builder/sections/FAQRenderer";
import FeaturesRenderer from "@/components/page-builder/sections/FeaturesRenderer";
import GalleryRenderer from "@/components/page-builder/sections/GalleryRenderer";
import ContactFormRenderer from "@/components/page-builder/sections/ContactFormRenderer";
import CustomHTMLRenderer from "@/components/page-builder/sections/CustomHTMLRenderer";

const renderers: Record<string, React.FC<{ config: any; isEditor?: boolean }>> = {
  hero: HeroRenderer, benefits: BenefitsRenderer, pricing: PricingRenderer,
  cta: CTARenderer, testimonials: TestimonialsRenderer, faq: FAQRenderer,
  features: FeaturesRenderer, gallery: GalleryRenderer, contact_form: ContactFormRenderer,
  custom_html: CustomHTMLRenderer,
};

const PublicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState<any[]>([]);
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const { data: pageData } = await supabase.from("landing_pages").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (!pageData) { setLoading(false); return; }
      setPage(pageData);

      const { data: sectionsData } = await supabase.from("landing_page_sections").select("*").eq("page_id", pageData.id).eq("is_visible", true).order("order", { ascending: true });
      setSections(sectionsData || []);

      // Track page view
      const params = new URLSearchParams(window.location.search);
      const visitorId = localStorage.getItem("_vid") || (() => { const id = Math.random().toString(36).substring(2); localStorage.setItem("_vid", id); return id; })();
      await supabase.from("page_views").insert({
        page_id: pageData.id, visitor_id: visitorId,
        utm_source: params.get("utm_source"), utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"), utm_content: params.get("utm_content"),
        utm_term: params.get("utm_term"), referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });

      // Inject pixels
      if (pageData.pixel_meta_id) {
        const s = document.createElement("script");
        s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pageData.pixel_meta_id}');fbq('track','PageView');`;
        document.head.appendChild(s);
      }
      if (pageData.pixel_google_id) {
        const s1 = document.createElement("script");
        s1.src = `https://www.googletagmanager.com/gtag/js?id=${pageData.pixel_google_id}`;
        s1.async = true;
        document.head.appendChild(s1);
        const s2 = document.createElement("script");
        s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${pageData.pixel_google_id}');`;
        document.head.appendChild(s2);
      }

      // Set meta tags
      if (pageData.meta_title) document.title = pageData.meta_title;
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><p className="text-white/50">Carregando...</p></div>;
  if (!page) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center flex-col gap-4"><p className="text-white/50">Página não encontrada</p></div>;

  return (
    <div>
      {sections.map((section) => {
        const Renderer = renderers[section.section_type];
        if (!Renderer) return null;
        return <Renderer key={section.id} config={section.config} />;
      })}
    </div>
  );
};

export default PublicPage;
