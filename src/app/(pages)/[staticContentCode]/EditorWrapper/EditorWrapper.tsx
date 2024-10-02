"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import { ContentData, Editor } from "../../member/program/_parts/Editor/Editor";

interface EditorWrapperProps {
  isAdmin: boolean;
}

export const EditorContentWrapper = ({ isAdmin }: EditorWrapperProps) => {
  const params = useParams();
  const contentCode = params.staticContentCode as string;

  const generateUploadUrl = useMutation(api.fromImages.generateUploadUrl);
  const deleteImage = useMutation(api.fromImages.deleteImage);
  const getImageURL = useMutation(api.fromImages.getImageURL);
  const saveContent = useMutation(api.fromStaticContent.saveStaticContent);
  const deleteLessonByLessonCode = useMutation(
    api.fromStaticContent.deleteContentByCode
  );

  const [isAdminSwitch, setIsAdminSwitch] = useState(isAdmin);

  // Fetch lesson data using the getLessonById query
  const contentFromDb = useQuery(api.fromStaticContent.getStaticContentByCode, {
    contentCode: contentCode,
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
            isAdminSwitch ? "max-w-[900px]" : "max-w-[1000px]"
          )}
        >
          <h1 className="text-6xl text-center font-bold mb-16">
            {contentFromDb?.title}
          </h1>
          {contentFromDb && (
            <Editor
              isAdmin={isAdminSwitch}
              pageId={contentCode}
              contentFromDb={contentFromDb}
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
