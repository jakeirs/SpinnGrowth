import { FC } from "react";
import { CircularCheckbox } from "./CircularCheckbox";

export interface LessonProps {
  title: string;
  notes: string;
  checked: boolean;
}

export const LessonItem: FC<LessonProps> = ({ title, checked, notes }) => (
  <div className="flex items-center py-4 px-4 cursor-pointer">
    <div className="min-w-[40px] flex justify-center">
      <CircularCheckbox checked={checked} />
    </div>
    <div className="ml-2 p-1">
      <span className="ml-3 text-lg font-light text-gray-700">{title}</span>

      {notes && (
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span>Notes: {notes}</span>
        </div>
      )}
    </div>
  </div>
);
