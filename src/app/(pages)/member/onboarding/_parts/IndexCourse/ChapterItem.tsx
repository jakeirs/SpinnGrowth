"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircularCheckbox } from "./CircularCheckbox";
import { LessonItem, LessonProps } from "./LessonItem";

interface ChapterItemProps {
  title: string;
  notes?: string;
  checked: boolean;
  onToggle: () => void;
  subLessons?: LessonProps[];
}

export const ChapterItem: FC<ChapterItemProps> = ({
  title,
  notes,
  checked,
  onToggle,
  subLessons = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-200 bg-white">
      <div
        className="flex items-center py-3 px-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="min-w-[40px] flex justify-center">
          <CircularCheckbox checked={checked} size="medium" />
        </div>
        {/** TITLE ITEM */}
        <div className="ml-4 flex items-center justify-between w-full">
          <div>
            <h3 className="text-xl font-medium text-gray-900">{title}</h3>
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
          {/** COLLAPSABLE ARROW */}
          {subLessons.length > 0 && (
            <motion.div
              className="w-auto"
              initial={false}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && subLessons.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {subLessons.map((subLesson, index) => (
              <LessonItem
                key={index}
                {...subLesson}
                isLast={subLessons.length === index + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
