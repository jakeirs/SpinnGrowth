"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "convex/react";
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

  // Fetch lesson data using the getLessonById query
  const lessonFromDb = useQuery(api.fromLessons.getLessonById, {
    lessonCode: selectedLessonId,
  });

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
