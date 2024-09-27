import { FC } from "react";
import { SectionItem } from "./SectionItem";

export const CourseIndex: FC = () => {
  const sections = [
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
      {sections.map((section) => (
        <SectionItem key={section.id} title={section.title} />
      ))}
    </div>
  );
};
