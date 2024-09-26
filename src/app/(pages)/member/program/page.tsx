"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Editor } from "./_parts/Editor";
import { Sidebar } from "./_parts/Sidebar/Sidebar";
import { SelectedLessonType } from "./_parts/Sidebar/config";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSessionId } from "convex-helpers/react/sessions";

export default function CoursePage() {
  const [sessionId] = useSessionId();
  const userRole = useQuery(api.fromUsers.getRole, { sessionId: sessionId! });
  const isAdmin = userRole?.role === "admin";

  const [isAdminSwitch, setIsAdminSwitch] = useState(isAdmin);
  const [expanded, setExpanded] = useState({});
  const [completed, setCompleted] = useState({});
  const [selectedLesson, setSelectedLesson] =
    useState<SelectedLessonType>(null);

  return (
    <div className="flex h-screen">
      <Sidebar
        expanded={expanded}
        setExpanded={setExpanded}
        completed={completed}
        setCompleted={setCompleted}
        setSelectedLesson={setSelectedLesson}
      />
      <main className="flex-1 p-6">
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
      </main>
    </div>
  );
}
