import { ScrollArea } from "@/components/ui/scroll-area";
import { CourseIndex } from "../onboarding/_parts/IndexCourse/CourseIndex";
import NavigationCourse from "../onboarding/_parts/NavigationCourse/NavigationCourse";

export default function IndexPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen-minus-header">
      <div className="flex flex-col md:flex-row bg-gray-100 h-full">
        <CourseIndex />
      </div>
      <main className="6 flex flex-col justify-between w-full">
        <ScrollArea>{children}</ScrollArea>
        <NavigationCourse />
      </main>
    </div>
  );
}
