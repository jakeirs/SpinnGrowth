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
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface EditorProps {
  isAdmin: boolean;
  lessonFromDb: Doc<"lessons">;
}

export const Editor = ({ isAdmin, lessonFromDb }: EditorProps) => {
  const params = useParams();
  const lessonId = params.id as string;

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
          rel: 'noopener noreferrer',
          target: '_blank',
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
    if (editor && lessonFromDb.content) {
      editor.commands.setContent(lessonFromDb.content);
    }
  }, [editor, lessonFromDb?.content]);

  return (
    <div>
      {isAdmin && lessonFromDb && (
        <EditorTools
          editor={editor}
          title={lessonFromDb.title}
          lessonCode={lessonId}
          nextLessonCode={lessonFromDb.nextLesson}
          notes={lessonFromDb.notes}
        />
      )}
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
};