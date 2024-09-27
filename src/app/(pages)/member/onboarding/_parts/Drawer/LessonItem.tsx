"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircularCheckbox } from "./CircularCheckbox";

interface LessonItemProps {
  title: string;
  notes?: string;
  checked: boolean;
  onToggle: () => void;
}

export const LessonItem: FC<LessonItemProps> = ({
  title,
  notes,
  checked,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-200 bg-white">
      <div
        className="flex items-center py-3 px-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-10 flex-shrink-0 flex justify-center">
          <CircularCheckbox checked={checked} onChange={onToggle} />
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <motion.div
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
      </div>
      <AnimatePresence>
        {isExpanded && notes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-4 pb-3 overflow-hidden"
          >
            <div className="flex items-center text-xs text-gray-500">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
