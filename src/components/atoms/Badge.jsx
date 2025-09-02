import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
    primary: "bg-gradient-to-r from-primary/10 to-primary/20 text-primary border border-primary/30",
    secondary: "bg-gradient-to-r from-secondary/10 to-secondary/20 text-secondary border border-secondary/30",
    accent: "bg-gradient-to-r from-accent/10 to-accent/20 text-accent border border-accent/30",
    success: "bg-gradient-to-r from-success/10 to-success/20 text-success border border-success/30",
    warning: "bg-gradient-to-r from-warning/10 to-warning/20 text-warning border border-warning/30",
    error: "bg-gradient-to-r from-error/10 to-error/20 text-error border border-error/30",
    info: "bg-gradient-to-r from-info/10 to-info/20 text-info border border-info/30"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;