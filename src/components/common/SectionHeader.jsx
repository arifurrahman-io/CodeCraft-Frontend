const SectionHeader = ({
  subtitle,
  title,
  description,
  alignment = "center",
  className = "",
}) => {
  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`max-w-3xl mx-auto ${alignments[alignment]} ${className}`}>
      {subtitle && (
        <p className="text-sm font-medium text-cyan-500 uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
          {title}
        </h2>
      )}
      {description && <p className="text-slate-400 text-lg">{description}</p>}
    </div>
  );
};

export default SectionHeader;
