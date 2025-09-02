import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  required,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all duration-200",
          "focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none",
          "hover:border-gray-300",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          error && "border-error focus:border-error focus:ring-error/10",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;