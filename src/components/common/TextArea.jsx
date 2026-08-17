const TextArea = ({ label, error, className = "", rows = 4, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      )}
      <textarea
        rows={rows}
        className={`
          w-full px-4 py-3 bg-surface border border-border rounded-lg
          text-ink placeholder:text-ink-subtle
          focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
          transition-colors duration-200 resize-none
          ${error ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextArea;
