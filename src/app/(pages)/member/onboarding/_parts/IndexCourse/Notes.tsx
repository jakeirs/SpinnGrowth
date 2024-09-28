import { FC } from "react";

export interface LessonNotes {
  notes?: string;
}

export const trimText = (
  text: string | undefined,
  maxLength: number = 65
): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const LessonNotes: FC<LessonNotes> = ({ notes = "" }) => {
  const trimmedNotes = trimText(notes);

  return (
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
  );
};
