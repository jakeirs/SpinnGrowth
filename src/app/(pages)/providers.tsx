"use client";
import { SessionProvider } from "convex-helpers/react/sessions";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <SessionProvider storageKey="AppSessionId">{children}</SessionProvider>
    </ConvexProvider>
  );
}
