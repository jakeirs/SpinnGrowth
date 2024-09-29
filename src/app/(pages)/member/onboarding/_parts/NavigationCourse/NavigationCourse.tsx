"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Switch } from "@/components/ui/switch";
import { useSessionId } from "convex-helpers/react/sessions";
import { useParams } from "next/navigation";

export const NavigationCourse: React.FC = () => {
  const [sessionId] = useSessionId();
  const params = useParams<{ id: string }>();
  const lessonCode = params.id;
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

  const handleToggle = async (checked: boolean) => {
    if (sessionId) {
      try {
        const result = await setProgressOfProgram({
          lessonCode,
          sessionId,
        });

        if (result.success) {
          console.log(
            `Lesson ${lessonCode} marked as ${result.complete ? "complete" : "incomplete"}`
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
    <div className="flex items-center justify-between p-4 border-b">
      <span>Lesson: {lessonCode}</span>
      <Switch
        checked={lessonComplete}
        onCheckedChange={handleToggle}
        aria-label={`Mark lesson ${lessonCode} as ${lessonComplete ? "incomplete" : "complete"}`}
      />
    </div>
  );
};

export default NavigationCourse;
