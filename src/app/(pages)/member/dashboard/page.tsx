import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTE_NAMES } from "../../routes";

export default function DashboardPage() {
  return (
    <div>
      <Link href={ROUTE_NAMES.MemberProgram}>
        <Button>To Porgram</Button>
      </Link>
    </div>
  );
}
