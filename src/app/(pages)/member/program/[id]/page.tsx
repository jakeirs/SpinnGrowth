"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSessionId } from "convex-helpers/react/sessions";
import { EditorCourseWrapper } from "../_parts/EditorWrapper/EditorWrapper";

export default function CoursePage() {
  const router = useRouter();
  const [sessionId] = useSessionId();

  const userRole = useQuery(api.fromUsers.getRole, { sessionId: sessionId! });
  const isAdmin = userRole?.role === "admin";
  const isMember = userRole?.role === "admin" || userRole?.role === "member";
  if (userRole && !isMember) {
    router.push("/");
  }

  return <EditorCourseWrapper isAdmin={isAdmin} />;
}
