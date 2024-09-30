"use client";

import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Switch } from "@/components/ui/switch";
import { useSessionId } from "convex-helpers/react/sessions";
import { useParams, useRouter } from "next/navigation";
import { ROUTE_NAMES } from "@/app/(pages)/routes";

export const NavigationCourse: React.FC = () => {
  const [sessionId] = useSessionId();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lessonCode = params.id ? params.id : "0-0-0";
  const setProgressOfProgram = useMutation(
    api.fromProgress.setProgressOfProgram
  );
  const lessonProgress = useQuery(api.fromProgress.getUserProgress, {
    sessionId: sessionId!,
  });

  let lessonComplete = false;
  if (lessonProgress) {
    lessonComplete = !!lessonProgress.includes(lessonCode);
  }

  const lesson = useQuery(api.fromLessons.getLessonById, {
    lessonCode,
  });

  const nextLessonCode = lesson?.nextLesson;

  const handleToggle = async (checked: boolean) => {
    if (sessionId) {
      try {
        const result = await setProgressOfProgram({
          lessonCode,
          sessionId,
        });

        if (result.success) {
          result.complete &&
            router.push(
              `/member/${ROUTE_NAMES.MemberProgram}/${nextLessonCode ? nextLessonCode : lessonCode}`
            );
        } else {
          console.error("Failed to update lesson progress:", result.message);
        }
      } catch (error) {
        console.error("Error updating lesson progress:", error);
      }
    } else {
      console.error("User not authenticated");
    }
  };

  return (
    <div className="flex items-center justify-center p-4 border-t w-full">
      <div className="flex gap-4">
        <span>Lesson {lessonComplete ? "complete" : "incomplete"}</span>
        <Switch
          checked={lessonComplete}
          onCheckedChange={handleToggle}
          aria-label={`Mark lesson ${lessonCode} as ${lessonComplete ? "incomplete" : "complete"}`}
        />
      </div>
    </div>
  );
};

export default NavigationCourse;
