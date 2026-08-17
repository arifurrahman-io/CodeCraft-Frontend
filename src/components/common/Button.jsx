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
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ease-smooth disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-canvas";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-hover hover:shadow-soft focus:ring-accent/40",
    secondary: "bg-ink text-white hover:bg-ink/90 focus:ring-ink/30",
    outline:
      "border border-border-strong bg-surface text-ink hover:bg-canvas hover:border-ink/20 focus:ring-accent/30",
    ghost: "text-ink-muted hover:text-ink hover:bg-ink/5 focus:ring-ink/20",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/40",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500/40",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
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
