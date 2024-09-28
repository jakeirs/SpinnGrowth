import { FC } from "react";
import { CircularCheckbox } from "./CircularCheckbox";
import { trimText } from "./Notes";

export interface LessonProps {
  title: string;
  notes?: string;
  checked?: boolean;
  isLast?: boolean;
}

export const LessonItem: FC<LessonProps> = ({
  title,
  checked = false,
  notes = "",
  isLast,
}) => {
  const trimmedTitle = trimText(title, 55);
  const trimmedNotes = trimText(notes);

  return (
    <div className="flex items-center py-3 px-4 h-20 cursor-pointer hover:bg-gray-200 transition-colors duration-150">
      <div className="min-w-[40px] flex justify-center relative">
        <CircularCheckbox checked={checked} />
        {!isLast && (
          <div className="border-r-2 border-gray-400 h-8 w-7 absolute -bottom-11 -left-1/2 translate-x-1/2"></div>
        )}
      </div>
      <div className="ml-4 p-1">
        <h3 className="ml-3 text-lg text-left leading-none">{trimmedTitle}</h3>

        {notes && (
          <div className="flex items-center px-3 text-xs text-gray-700 mt-1">
            <svg
              className="w-5 h-5 mr-1 min-w-[22px]"
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
            <span title={`Notes: ${notes}`}>{trimmedNotes}</span>
          </div>
        )}
      </div>
    </div>
  );
};
