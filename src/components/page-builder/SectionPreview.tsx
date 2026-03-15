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

interface Section { id: string; section_type: string; order: number; config: any; is_visible: boolean; }

const renderers: Record<string, React.FC<{ config: any; isEditor?: boolean }>> = {
  hero: HeroRenderer, benefits: BenefitsRenderer, pricing: PricingRenderer,
  cta: CTARenderer, testimonials: TestimonialsRenderer, faq: FAQRenderer,
  features: FeaturesRenderer, gallery: GalleryRenderer, contact_form: ContactFormRenderer,
  custom_html: CustomHTMLRenderer,
};

const SectionPreview = ({ sections, selectedId, onSelect }: {
  sections: Section[]; selectedId?: string | null; onSelect?: (id: string) => void;
}) => {
  const isEditor = !!onSelect;
  return (
    <div>
      {sections.map((section) => {
        const Renderer = renderers[section.section_type];
        if (!Renderer) return null;
        return (
          <div key={section.id} onClick={() => onSelect?.(section.id)}
            className={`relative ${isEditor ? "cursor-pointer" : ""} transition-all ${selectedId === section.id ? "ring-2 ring-lime/40 ring-inset" : isEditor ? "hover:ring-1 hover:ring-border hover:ring-inset" : ""}`}>
            <Renderer config={section.config} isEditor={isEditor} />
          </div>
        );
      })}
      {sections.length === 0 && (
        <div className="flex items-center justify-center h-96 text-muted-foreground text-sm">
          Adicione seções para começar
        </div>
      )}
    </div>
  );
};

export default SectionPreview;
