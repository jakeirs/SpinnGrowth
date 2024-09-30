"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSessionId } from "convex-helpers/react/sessions";
import { Editor } from "../_parts/Editor/Editor";
import clsx from "clsx";

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
    <div>
      {isAdmin ? (
        <div className="flex justify-end p-6">
          <span className="mr-2">Admin Mode</span>
          <Switch checked={isAdminSwitch} onCheckedChange={setIsAdminSwitch} />
        </div>
      ) : null}
      <div className="flex justify-center">
        <main
          className={clsx(
            "flex-1 p-6 flex flex-col ",
            isAdminSwitch ? "max-w-[900px]" : "max-w-[665px]"
          )}
        >
          <h1 className="text-6xl text-center font-bold mb-16">
            {lessonFromDb?.title}
          </h1>
          {lessonFromDb && (
            <Editor isAdmin={isAdminSwitch} lessonFromDb={lessonFromDb} />
          )}
        </main>
      </div>
    </div>
  );
}
