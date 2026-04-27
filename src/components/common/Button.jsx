import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";

  const variants = {
    primary: "bg-cyan-500 text-slate-900 hover:bg-cyan-400 focus:ring-cyan-500",
    secondary:
      "bg-slate-700 text-slate-100 hover:bg-slate-600 focus:ring-slate-500",
    outline:
      "border border-slate-600 text-slate-100 hover:bg-slate-800 focus:ring-slate-500",
    ghost:
      "text-slate-300 hover:text-slate-100 hover:bg-slate-800 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};

export default Button;
