const Input = ({ label, error, icon: Icon, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg 
            text-slate-100 placeholder-slate-500 
            focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent 
            transition-all duration-200
            ${Icon ? "pl-11" : ""}
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
