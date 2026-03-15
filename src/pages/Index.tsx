import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import SectionPreview from "@/components/page-builder/SectionPreview";

const MAIN_PAGE_SLUG = "_main_page";

const Index = () => {
  const [sections, setSections] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMainPage = async () => {
      const { data: page } = await supabase.from("landing_pages").select("id, is_published").eq("slug", MAIN_PAGE_SLUG).single();
      if (page?.is_published) {
        const { data: secs } = await supabase.from("landing_page_sections").select("*").eq("page_id", page.id).order("order", { ascending: true });
        if (secs && secs.length > 0) {
          setSections(secs.filter((s: any) => s.is_visible));
        }
      }
      setLoading(false);
    };
    loadMainPage();
  }, []);

  if (loading) return <div className="min-h-screen bg-background" />;

  // If main page exists and is published, render from builder
  if (sections && sections.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <SectionPreview sections={sections} />
        <Footer />
      </div>
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="beneficios"><BenefitsSection /></div>
      <PricingSection />
      <div id="contato"><CTASection /></div>
      <Footer />
    </div>
  );
};

export default Index;
