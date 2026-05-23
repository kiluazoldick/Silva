import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  hover?: boolean;
}

export const Card = ({
  children,
  className,
  title,
  subtitle,
  hover = false,
}: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-warm-gray-100 bg-white p-6 transition-all duration-200",
        hover && "hover:border-warm-gray-200 hover:shadow-sm",
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-base font-semibold text-warm-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-warm-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
