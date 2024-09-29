"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { SelectedLessonType } from "../_parts/Sidebar/config";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSessionId } from "convex-helpers/react/sessions";
import { Editor } from "../_parts/Editor/Editor";

export default function CoursePage() {
  const params = useParams();
  const selectedLessonId = params.id as string;

  const [sessionId] = useSessionId();
  const userRole = useQuery(api.fromUsers.getRole, { sessionId: sessionId! });
  const isAdmin = userRole?.role === "admin";

  const [isAdminSwitch, setIsAdminSwitch] = useState(isAdmin);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [selectedLesson, setSelectedLesson] =
    useState<SelectedLessonType>(selectedLessonId);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  const setProgressOfProgram = useMutation(
    api.fromProgress.setProgressOfProgram
  );
  const userProgressFromDb = useQuery(api.fromProgress.getUserProgress, {
    sessionId: sessionId!,
  });
  // Fetch lesson data using the getLessonById query
  const lessonFromDb = useQuery(api.fromLessons.getLessonById, {
    lessonId: selectedLessonId,
  });

  useEffect(() => {
    setSelectedLesson(selectedLessonId);
  }, [selectedLessonId]);

  useEffect(() => {
    if (userProgressFromDb) {
      const newCompleted: Record<string, boolean> = {};
      userProgressFromDb.forEach((lessonCode: string) => {
        newCompleted[lessonCode] = true;
      });
      setCompleted(newCompleted);
    }
  }, [userProgressFromDb]);

  useEffect(() => {
    if (selectedLesson && completed) {
      setIsLessonComplete(!!completed[selectedLesson]);
    }
  }, [selectedLesson, completed]);

  const handleLessonCompletion = async (checked: boolean) => {
    if (selectedLesson && sessionId) {
      const result = await setProgressOfProgram({
        lessonCode: selectedLesson,
        sessionId: sessionId,
      });
      if (result.success && result.complete !== undefined) {
        setCompleted((prev) => ({
          ...prev,
          [selectedLesson]: result.complete,
        }));
        setIsLessonComplete(result.complete);
      }
    }
  };
  return (
    <div className="flex">
      <main className="flex-1 p-6 flex flex-col">
        <div className="flex justify-end mb-4">
          {isAdmin ? (
            <div className="flex items-center">
              <span className="mr-2">Admin Mode</span>
              <Switch
                checked={isAdminSwitch}
                onCheckedChange={setIsAdminSwitch}
              />
            </div>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold mb-4">{lessonFromDb?.title}</h1>
        {lessonFromDb && (
          <Editor isAdmin={isAdminSwitch} lessonFromDb={lessonFromDb} />
        )}
      </main>
    </div>
  );
}
