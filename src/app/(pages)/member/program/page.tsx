import { redirect } from "next/navigation";

export default async function CoursePage() {
  redirect("program/0-0-0");
  return null;
}
