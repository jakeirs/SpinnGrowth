import { FC } from "react";
import { CircularCheckbox } from "./CircularCheckbox";

export interface LessonProps {
  title: string;
  checked: boolean;
  onToggle: () => void;
}

export const LessonItem: FC<LessonProps> = ({ title, checked, onToggle }) => (
  <div className="flex items-center py-2 px-4 ml-10">
    <CircularCheckbox checked={checked} onChange={onToggle} />
    <span className="ml-3 text-sm text-gray-700">{title}</span>
  </div>
);
