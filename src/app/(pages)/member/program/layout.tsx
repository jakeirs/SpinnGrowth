import { CourseIndex } from "../onboarding/_parts/IndexCourse/CourseIndex";

export default function IndexPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex ">
      <div className="flex flex-col md:flex-row h-screen-minus-header bg-gray-100">
        <CourseIndex />
      </div>
      <main className="p-6 flex flex-col">{children}</main>
    </div>
  );
}
