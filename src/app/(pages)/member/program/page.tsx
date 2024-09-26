"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Editor } from "./_parts/Editor";
import { Sidebar } from "./_parts/Sidebar/Sidebar";
import { SelectedLessonType } from "./_parts/Sidebar/config";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSessionId } from "convex-helpers/react/sessions";

export default function CoursePage() {
  const [sessionId] = useSessionId();
  const userRole = useQuery(api.fromUsers.getRole, { sessionId: sessionId! });
  const isAdmin = userRole?.role === "admin";

  const [isAdminSwitch, setIsAdminSwitch] = useState(isAdmin);
  const [expanded, setExpanded] = useState({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [selectedLesson, setSelectedLesson] =
    useState<SelectedLessonType>(null);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  const setProgressOfProgram = useMutation(
    api.fromProgress.setProgressOfProgram
  );
  const userProgress = useQuery(api.fromProgress.getUserProgress, {
    sessionId: sessionId!,
  });

  useEffect(() => {
    /** { // completed:
     *    0: true,
     *    0-1: false,
     *  }
     */
    if (userProgress) {
      const newCompleted: Record<string, boolean> = {};
      userProgress.forEach((lessonCode: string) => {
        newCompleted[lessonCode] = true;
      });
      // setCompleted
      setCompleted(newCompleted);
    }
  }, [userProgress]);

  useEffect(() => {
    if (selectedLesson && completed) {
      // setIsLessonComplete => Button Complete Lesson
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
    <div className="flex h-screen">
      <Sidebar
        expanded={expanded}
        setExpanded={setExpanded}
        completed={completed}
        setSelectedLesson={setSelectedLesson}
      />
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
        <h1 className="text-2xl font-bold mb-4">Course Title</h1>
        <Editor isAdmin={isAdminSwitch} selectedLesson={selectedLesson} />
        {selectedLesson && (
          <div className="mt-4 flex items-center justify-end">
            <span className="mr-2">Mark lesson as complete</span>
            <Switch
              checked={isLessonComplete}
              onCheckedChange={handleLessonCompletion}
            />
          </div>
        )}
      </main>
    </div>
  );
}
