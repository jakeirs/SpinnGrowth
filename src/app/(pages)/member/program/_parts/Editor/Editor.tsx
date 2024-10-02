"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { EditorTools } from "./EditorTools";
import { useEffect } from "react";
import {
  createCustomImagePaste,
  CustomImage,
  onEditDeleteImageFromStorageConvex,
} from "./custom-extension";

export interface ContentData {
  content: string;
  title?: string;
  nextLesson?: string;
  notes?: string;
}

interface EditorProps {
  isAdmin: boolean;
  contentFromDb: ContentData;
  pageId: string;
  saveContent: (args: any) => Promise<any>;
  deleteLessonByLessonCode: (args: any) => Promise<any>;
  deleteImage: (args: any) => Promise<any>;
  generateUploadUrl: () => Promise<any>;
  getImageURL: (args: any) => Promise<any>;
}

export const Editor = ({
  isAdmin,
  contentFromDb,
  pageId,
  saveContent,
  deleteLessonByLessonCode,
  deleteImage,
  generateUploadUrl,
  getImageURL,
}: EditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CustomImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "mx-auto",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      /** Another Extension */
      createCustomImagePaste(async (file: File) => {
        const postUrl = await generateUploadUrl();
        // Here you would typically upload the file to the URL

        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file!.type },
          body: file,
        });
        const { storageId } = await result.json();

        // We'll just return the URL
        const imageUrl = await getImageURL({ storageId });
        return { storageId, url: imageUrl };
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        inline: true,
        HTMLAttributes: {
          class: "w-full aspect-square h-auto lg:px-20 sm:aspect-video",
          height: 0,
          width: 0,
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: isAdmin
          ? "prose max-w-none p-4 focus:outline-none min-h-[300px]  border rounded-lg"
          : "prose max-w-none focus:outline-none min-h-[300px]",
      },
    },
    editable: isAdmin,
    onCreate: ({ editor }) => {
      editor.on("update", ({ editor, transaction }) => {
        onEditDeleteImageFromStorageConvex({ transaction, deleteImage });
      });
    },
  });

  useEffect(() => {
    if (editor && contentFromDb.content) {
      editor.commands.setContent(contentFromDb.content);
    }
  }, [editor, contentFromDb.content]);

  return (
    <div>
      {isAdmin && (
        <EditorTools
          editor={editor}
          contentFromDb={contentFromDb}
          contentCode={pageId}
          saveContent={saveContent}
          deleteLessonByLessonCode={deleteLessonByLessonCode}
        />
      )}
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
};
