import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  icon,
  loading = false,
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-secondary to-secondary-700 text-white hover:from-secondary-600 hover:to-secondary-800 shadow-lg hover:shadow-xl",
    accent: "bg-gradient-to-r from-accent to-green-600 text-white hover:from-accent-600 hover:to-green-700 shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-primary-700 hover:text-white hover:shadow-lg",
    ghost: "text-gray-600 hover:bg-gradient-to-r hover:from-surface hover:to-gray-100 hover:text-gray-900",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {icon && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;