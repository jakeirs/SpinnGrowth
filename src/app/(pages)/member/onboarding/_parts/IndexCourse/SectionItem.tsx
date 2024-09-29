"use client";
import { FC, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChapterItem } from "./ChapterItem";
import { CourseChapters } from "@/convex/fromLessons";

export interface SectionItemProps {
  lessonCode: string;
  title: string;
  chapters: CourseChapters[];
  userProgress: string[];
  allLessons: string[];
}

export const SectionItem: FC<SectionItemProps> = ({
  title,
  chapters,
  userProgress,
  allLessons,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const progressCount = useMemo(() => {
    return userProgress.filter((progress) => allLessons.includes(progress))
      .length;
  }, [userProgress, allLessons]);

  const progressPercentage = useMemo(() => {
    return allLessons.length > 0
      ? Math.round((progressCount / allLessons.length) * 100)
      : 0;
  }, [progressCount, allLessons]);

  return (
    <div>
      <div
        className="bg-white p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
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
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 mt-1 inline-block">
          {progressPercentage}% ({progressCount}/{allLessons.length})
        </span>
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
            {chapters.map((chapter) => (
              <ChapterItem
                key={chapter.lessonCode}
                lessonCode={chapter.lessonCode}
                title={chapter.title}
                notes={chapter.notes || undefined}
                checked={userProgress.includes(chapter.lessonCode)}
                userProgress={userProgress}
                onToggle={() => {}}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
