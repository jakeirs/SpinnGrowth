"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Doc } from "@/convex/_generated/dataModel";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { EditorTools } from "./EditorTools";
import { useEffect } from "react";

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
}

export const Editor = ({ 
  isAdmin, 
  contentFromDb, 
  pageId, 
  saveContent, 
  deleteLessonByLessonCode 
}: EditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
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
    ],
    editorProps: {
      attributes: {
        class: isAdmin
          ? "prose max-w-none p-4 focus:outline-none min-h-[300px] border rounded-lg"
          : "prose max-w-none focus:outline-none min-h-[300px]",
      },
    },
    editable: isAdmin,
  });

  useEffect(() => {
    if (editor && contentFromDb.content) {
      editor.commands.setContent(contentFromDb.content);
    }
  }, [editor, contentFromDb.content]);

  return (
    <div>
      {isAdmin && contentFromDb && (
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
