"use client";

import { useSessionId } from "convex-helpers/react/sessions";
import { EditorContentWrapper } from "./EditorWrapper/EditorWrapper";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ContentPage() {
  const [sessionId] = useSessionId();

  const userRole = useQuery(api.fromUsers.getRole, { sessionId: sessionId! });
  const isAdmin = userRole?.role === "admin";
  return <EditorContentWrapper isAdmin={isAdmin} />;
}
