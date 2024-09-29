"use client";

import { FC } from "react";
import { SectionItem } from "./SectionItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { transformLessonsForCourseIndex } from "@/convex/fromLessons";
import { useSessionId } from "convex-helpers/react/sessions";

export const CourseIndex: FC = () => {
  const [sessionId] = useSessionId();
  // const allLessons = useQuery(api.fromLessons.getAllLessons);
  const userProgress = useQuery(api.fromProgress.getUserProgress, {
    sessionId: sessionId!,
  });

  // if (!allLessons || !userProgress) {
  //   return null;
  // }

  // const transformed = transformLessonsForCourseIndex(allLessons);

  return (
    <ScrollArea className="w-full md:w-[420px] bg-gray-100 shadow-lg flex flex-col ">
      {/* {transformed.map((section) => (
        <SectionItem key={section.lessonCode} {...section} />
      ))} */}
    </ScrollArea>
  );
};
