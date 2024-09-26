"use client";

import React from "react";
import { Check } from "lucide-react";

interface CircleCheckboxProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  readOnly?: boolean;
}

export const CircleCheckbox: React.FC<CircleCheckboxProps> = ({
  checked,
  onCheckedChange,
  className = "",
  readOnly = false,
}) => (
  <div
    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
      checked ? "bg-primary border-primary" : "border-gray-300"
    } ${className} ${readOnly ? "" : "cursor-pointer"}`}
    onClick={() => {
      if (!readOnly && onCheckedChange) {
        onCheckedChange(!checked);
      }
    }}
  >
    {checked && <Check className="text-primary-foreground" size={12} />}
  </div>
);
