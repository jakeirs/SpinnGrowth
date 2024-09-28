"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Sidebar } from "../_parts/Sidebar/Sidebar";
import { SelectedLessonType } from "../_parts/Sidebar/config";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSessionId } from "convex-helpers/react/sessions";
import { Editor } from "../_parts/Editor/Editor";
import { CourseIndex } from "../../onboarding/_parts/IndexCourse/CourseIndex";

export default function IndexPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <CourseIndex />
      </div>
      <main className="flex-1 p-6 flex flex-col">{children}</main>
    </div>
  );
}
