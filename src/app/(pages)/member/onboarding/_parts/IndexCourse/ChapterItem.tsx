"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { CircularCheckbox } from "./CircularCheckbox";
import { LessonItem, LessonProps } from "./LessonItem";
import { LessonNotes } from "./Notes";

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
  subLessons = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={clsx(
        "border-b border-gray-200 transition-colors duration-300",
        isExpanded ? "bg-gray-100" : "bg-white"
      )}
    >
      <div
        className={clsx(
          "flex items-center py-4 px-4 cursor-pointer transition-colors duration-300 border-b border-gray-200",
          isExpanded ? "bg-gray-100 border-b-2  " : "hover:bg-gray-200"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="min-w-[40px] flex justify-center">
          <CircularCheckbox checked={checked} size="medium" />
        </div>
        {/** TITLE ITEM */}
        <div className="ml-4 flex items-center justify-between w-full ">
          <div>
            <h3 className="text-2xl font-medium text-gray-900">{title}</h3>
            {notes && <LessonNotes notes={notes} />}
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
            className="overflow-hidden bg-gray-100"
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
