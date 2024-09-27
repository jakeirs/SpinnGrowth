"use client";
import { FC } from "react";
import { LessonItem } from "./LessonItem";

export const Drawer: FC = () => {
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
    <div className="w-full md:w-[420px] bg-gray-100 shadow-lg flex flex-col h-screen">
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">1. Growth Basics</h2>
        <div className="mt-2 bg-red-100 h-2 rounded-full">
          <div
            className="bg-red-500 h-full rounded-full"
            style={{ width: "16%" }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 mt-1 inline-block">16%</span>
      </div>
      <div className="overflow-y-auto flex-grow">
        {lessons.map((lesson) => (
          <LessonItem
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
    </div>
  );
};
