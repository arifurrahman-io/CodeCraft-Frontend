const SectionHeader = ({
  subtitle,
  title,
  description,
  alignment = "center",
  className = "",
}) => {
  const alignments = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <div className={`max-w-3xl ${alignments[alignment]} ${className}`}>
      {subtitle && (
        <p className="text-sm font-semibold text-accent tracking-wide mb-3">
          {subtitle}
        </p>
      )}
      {title && (
        <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-ink tracking-tight text-balance mb-4 leading-[1.15]">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-ink-muted text-lg leading-relaxed">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
