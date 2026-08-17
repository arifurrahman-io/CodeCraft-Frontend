const Input = ({ label, error, icon: Icon, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 bg-surface border border-border rounded-lg
            text-ink placeholder:text-ink-subtle
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
            transition-colors duration-200
            ${Icon ? "pl-11" : ""}
            ${error ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
