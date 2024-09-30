"use client";
import { FC, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChapterItem } from "./ChapterItem";
import { CourseChapters } from "@/convex/fromLessons";
import {
  calcChapterProgress,
  getProcessChapterProgress,
  resumeLessonOn,
} from "./utils";

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
  lessonCode,
}) => {
  const { activeSection } = resumeLessonOn(userProgress);
  const [isExpanded, setIsExpanded] = useState(activeSection === lessonCode);

  const processChapterProgress = useMemo(
    () => getProcessChapterProgress(allLessons, userProgress),
    [allLessons, userProgress]
  );

  const progressCountSection = useMemo(() => {
    return userProgress.filter((progress) => allLessons.includes(progress))
      .length;
  }, [userProgress, allLessons]);

  const progressPercentageSection = useMemo(() => {
    return allLessons.length > 0
      ? Math.round((progressCountSection / allLessons.length) * 100)
      : 0;
  }, [progressCountSection, allLessons]);

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
            style={{ width: `${progressPercentageSection}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 mt-1 inline-block">
          {progressPercentageSection}% ({progressCountSection}/
          {allLessons.length} lessons completed)
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
            {chapters.map((chapter) => {
              const { progressCount, progressPercentage, totalLessons } =
                calcChapterProgress({
                  chapterLessonCode: chapter.lessonCode,
                  processChapterProgress,
                  userProgress,
                });
              return (
                <ChapterItem
                  key={chapter.lessonCode}
                  lessonCode={chapter.lessonCode}
                  title={chapter.title}
                  notes={chapter.notes || undefined}
                  userProgress={userProgress}
                  checked={progressCount === totalLessons && totalLessons > 0}
                  onToggle={() => {}}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
