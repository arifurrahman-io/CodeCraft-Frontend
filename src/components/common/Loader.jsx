const Loader = ({ size = "md", className = "", text }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        className={`
          ${sizes[size]} 
          border-cyan-500 border-t-transparent 
          rounded-full animate-spin
        `}
      />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
};

export default Loader;
