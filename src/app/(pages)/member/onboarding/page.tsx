"use client";

import Link from "next/link";
import { ROUTE_NAMES } from "../../routes";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="flex-grow p-8">
        <Link href={ROUTE_NAMES.MemberDashboard}>
          <Button>To Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
