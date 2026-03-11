const CustomHTMLRenderer = ({ config: c }: { config: any; isEditor?: boolean }) => {
  return (
    <section style={{ backgroundColor: c.bgColor || "#0a0a0f", paddingTop: `${c.paddingY || 40}px`, paddingBottom: `${c.paddingY || 40}px` }}>
      <div className="max-w-5xl mx-auto px-6" dangerouslySetInnerHTML={{ __html: c.html || "" }} />
    </section>
  );
};

export default CustomHTMLRenderer;
