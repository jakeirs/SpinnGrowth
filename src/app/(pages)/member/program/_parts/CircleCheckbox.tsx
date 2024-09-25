"use client";

import React from "react";
import { Check } from "lucide-react";

interface CircleCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const CircleCheckbox: React.FC<CircleCheckboxProps> = ({
  checked,
  onCheckedChange,
  className = "",
}) => (
  <div
    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
      checked ? "bg-primary border-primary" : "border-gray-300"
    } ${className}`}
    onClick={() => onCheckedChange(!checked)}
  >
    {checked && <Check className="text-primary-foreground" size={12} />}
  </div>
);
