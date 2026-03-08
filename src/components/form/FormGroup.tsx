import React from "react";
import Label from "./Label";

interface FormGroupProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const FormGroup = ({ 
  label, 
  htmlFor, 
  error, 
  children, 
  required, 
  className = "" 
}: FormGroupProps) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor}>
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
         
      <div className="relative">
        {children}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};