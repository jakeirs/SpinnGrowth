import { FC } from "react";

interface CircularCheckboxProps {
  checked: boolean;
  isActive?: boolean;
  size?: "small" | "medium" | "large" | number;
}

export const CircularCheckbox: FC<CircularCheckboxProps> = ({
  checked: x,
  isActive,
  size = "small",
}) => {
  const checked = (x = false);
  const getSizeClasses = (size: "small" | "medium" | "large" | number) => {
    if (typeof size === "number") {
      return `w-${size} h-${size}`;
    }
    switch (size) {
      case "small":
        return "w-6 h-6";
      case "medium":
        return "w-8 h-8";
      case "large":
        return "w-9 h-9";
      default:
        return "w-6 h-6";
    }
  };

  const getIconSizeClasses = (size: "small" | "medium" | "large" | number) => {
    if (typeof size === "number") {
      return `w-${Math.max(4, size - 2)} h-${Math.max(4, size - 2)}`;
    }
    switch (size) {
      case "small":
        return "w-4 h-4";
      case "medium":
        return "w-5 h-5";
      case "large":
        return "w-6 h-6";
      default:
        return "w-4 h-4";
    }
  };

  const sizeClasses = getSizeClasses(size);
  const iconSizeClasses = getIconSizeClasses(size);

  return (
    <div
      className={`${sizeClasses} rounded-full border-2 flex items-center justify-center cursor-pointer 
             ${checked ? "bg-blue-300 border-blue-300" : `border-gray-400 bg-white ${isActive ? "bg-white " : ""}`}`}
    >
      {checked && (
        <svg
          className={`${iconSizeClasses} text-white`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
  );
};
