import { FC } from "react";

interface CircularCheckboxProps {
  checked: boolean;
  size?: string;
  onChange: () => void;
}

export const CircularCheckbox: FC<CircularCheckboxProps> = ({
  checked,
  onChange,
  size: sizeNumber = 6,
}) => {
  const size = String(sizeNumber);

  return (
    <div
      className={`w-${size} h-${size} rounded-full border-2 flex items-center justify-center cursor-pointer
                  ${checked ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}
      onClick={onChange}
    >
      {checked && (
        <svg
          className="w-4 h-4 text-white"
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
