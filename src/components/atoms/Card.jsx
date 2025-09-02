import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-sm backdrop-blur-sm",
        "hover:shadow-md transition-all duration-300",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

const CardContent = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      className={cn("p-6 pt-0", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

const CardTitle = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
      ref={ref}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

export { Card, CardHeader, CardContent, CardTitle };