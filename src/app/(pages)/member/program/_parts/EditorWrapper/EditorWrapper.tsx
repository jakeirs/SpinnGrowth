"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import { ContentData, Editor } from "../Editor/Editor";

interface EditorWrapperProps {
  isAdmin: boolean;
}

export const EditorCourseWrapper = ({ isAdmin }: EditorWrapperProps) => {
  const params = useParams();
  const lessonCode = params.id as string;

  const generateUploadUrl = useMutation(api.fromImages.generateUploadUrl);
  const deleteImage = useMutation(api.fromImages.deleteImage);
  const getImageURL = useMutation(api.fromImages.getImageURL);
  const saveContent = useMutation(api.fromLessons.uploadCourseData);
  const deleteLessonByLessonCode = useMutation(
    api.fromLessons.deleteLessonByLessonCode
  );

  const [isAdminSwitch, setIsAdminSwitch] = useState(false);

  // Fetch lesson data using the getLessonById query
  const lessonFromDb = useQuery(api.fromLessons.getLessonById, {
    lessonCode: lessonCode,
  }) as ContentData;

  return (
    <div>
      {isAdmin ? (
        <div className="flex justify-end p-6">
          <span className="mr-2">Admin Mode</span>
          <Switch checked={isAdminSwitch} onCheckedChange={setIsAdminSwitch} />
        </div>
      ) : null}
      <div className="flex justify-center">
        <main
          className={clsx(
            "flex-1 p-6 flex flex-col ",
            isAdminSwitch ? "max-w-[900px]" : "max-w-[665px]"
          )}
        >
          <h1 className="text-6xl text-center font-bold mb-16">
            {lessonFromDb?.title}
          </h1>
          {lessonFromDb && (
            <Editor
              isAdmin={isAdminSwitch}
              pageId={lessonCode}
              contentFromDb={lessonFromDb}
              saveContent={saveContent}
              deleteLessonByLessonCode={deleteLessonByLessonCode}
              generateUploadUrl={generateUploadUrl}
              deleteImage={deleteImage}
              getImageURL={getImageURL}
            />
          )}
        </main>
      </div>
    </div>
  );
};
