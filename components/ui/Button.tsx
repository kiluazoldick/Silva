import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      fullWidth,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-accent text-white hover:bg-accent-dark focus:ring-2 focus:ring-accent/20",
      secondary:
        "bg-warm-gray-100 text-warm-gray-700 hover:bg-warm-gray-200 focus:ring-2 focus:ring-warm-gray-200",
      outline:
        "border border-warm-gray-200 text-warm-gray-600 hover:border-warm-gray-300 hover:bg-warm-gray-50 focus:ring-2 focus:ring-warm-gray-200",
      danger:
        "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-2 focus:ring-red-200",
      ghost:
        "text-warm-gray-500 hover:text-warm-gray-700 hover:bg-warm-gray-50 focus:ring-2 focus:ring-warm-gray-200",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Chargement...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
