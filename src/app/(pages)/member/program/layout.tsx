import { CourseIndex } from "../onboarding/_parts/IndexCourse/CourseIndex";

export default function IndexPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <CourseIndex />
      </div>
      <main className="flex-1 p-6 flex flex-col">{children}</main>
    </div>
  );
}
