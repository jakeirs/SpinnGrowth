"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChapterItem } from "./ChapterItem";

export interface SectionItemProps {
  title: string;
}

export const SectionItem: FC<SectionItemProps> = ({ title }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const lessons = [
    {
      id: 1,
      title: "Growth Principles",
      notes: "Foundation of growth strategies",
    },
    {
      id: 2,
      title: "Why Growth Matters",
      notes: "Understanding the importance of growth",
    },
    {
      id: 3,
      title: "Guiding Principles of How to Approach Growth",
      notes: null,
    },
    { id: 4, title: "Why Growth Matters. Lay Your foundation", notes: null },
    {
      id: 5,
      title: "Why Growth Matters",
      notes: "I noted that Growth is exponential is Important",
    },
  ];

  return (
    <div>
      <div
        className="bg-white p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
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
        <div className="mt-2 bg-red-100 h-2 rounded-full">
          <div
            className="bg-red-500 h-full rounded-full"
            style={{ width: "16%" }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 mt-1 inline-block">16%</span>
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="">
              {lessons.map((lesson) => (
                <ChapterItem
                  key={lesson.id}
                  title={lesson.title}
                  notes={lesson.notes || undefined}
                  subLessons={[
                    {
                      title: "Sub Lesson 1",
                      checked: false,
                      onToggle: () => {
                        /* handle sub lesson 1 toggle */
                      },
                    },
                    {
                      title: "Sub Lesson 2",
                      checked: true,
                      onToggle: () => {
                        /* handle sub lesson 2 toggle */
                      },
                    },
                  ]}
                  checked={false}
                  onToggle={() => {}}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
