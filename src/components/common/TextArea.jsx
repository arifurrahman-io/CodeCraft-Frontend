const TextArea = ({ label, error, className = "", rows = 4, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg 
          text-slate-100 placeholder-slate-500 
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent 
          transition-all duration-200 resize-none
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea;
