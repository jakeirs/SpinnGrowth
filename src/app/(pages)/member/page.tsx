import { Button } from "@/components/ui/button";

export default function AuthorizedAccess() {
  return (
    <div>
      I registered, but didn't pay
      <div>
        Check me if I paid
        <Button asChild>Logout</Button>
      </div>
    </div>
  );
}
