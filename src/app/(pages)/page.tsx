"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTE_NAMES } from "./routes";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSessionId } from "convex-helpers/react/sessions";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { RolesEnum } from "@/convex/schema";

export default function HomePage() {
  const [_, refreshSessionId] = useSessionId();
  const saveSessionToDb = useMutation(api.fromUsers.setSessionForUser);
  const router = useRouter();

  // FUTURE: manage matching login & userId in the BE in internal mutations to not expose userId
  const onAdminLogin = async () => {
    const adminUserId = "j5728b9kg05a2m0s5vhj4xnktx71h45n" as Id<"users">;

    await refreshSessionId(async (newSessionId) => {
      const { document } = await saveSessionToDb({
        sessionId: newSessionId,
        userId: adminUserId,
      });

      if (document?.role !== "admin") {
        return console.log("user is not an admin");
      }
      router.push(`member/${ROUTE_NAMES.MemberProgram}`);
    });
  };

  const onMemberLogin = async () => {
    const memberUserId = "j57bzbsxdpj9bpn133ws261bmd71h6ba" as Id<"users">;

    await refreshSessionId(async (newSessionId) => {
      const { document } = await saveSessionToDb({
        sessionId: newSessionId,
        userId: memberUserId,
      });

      if (document?.role !== "member") {
        return console.log("user is not a member");
      }
      router.push(`member/${ROUTE_NAMES.MemberProgram}`);
    });
  };

  const onLogout = async () => {
    await refreshSessionId();
  };

  return (
    <section className="container grid items-center  gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <Card className="bg-gray-100">
          <CardContent className="p-6">
            <CardTitle className="text-xl font-bold mb-2">Navigation</CardTitle>
            <div className="flex gap-3">
              <Link href={`member/${ROUTE_NAMES.MemberOnboarding}`}>
                <Button>To onboarding</Button>
              </Link>
              <Link href={ROUTE_NAMES.Disclaimer}>
                <Button>To Disclaimer</Button>
              </Link>
              <Link href={ROUTE_NAMES.Terms}>
                <Button>To Terms</Button>
              </Link>
              <Link href={ROUTE_NAMES.Privacy}>
                <Button>To Privacy</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-100">
          <CardContent className="p-6">
            <CardTitle className="text-xl font-bold mb-2">Roles</CardTitle>
            <div className="flex gap-3 flex-col">
              <Button variant="secondary" onClick={onAdminLogin}>
                Login as Admin
              </Button>
              <Button variant="outline" onClick={onMemberLogin}>
                Login as Member
              </Button>
              <Button variant="destructive" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
