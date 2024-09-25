import { Button } from "@/components/ui/button";
import { ROUTE_NAMES } from "../../routes";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div>
      <Link href={ROUTE_NAMES.MemberDashboard}>
        <Button>To Dashboard</Button>
      </Link>
    </div>
  );
}
