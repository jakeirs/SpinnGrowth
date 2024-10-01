"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTE_NAMES } from "../../routes";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const CustomEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose max-w-none p-4 focus:outline-none min-h-[300px] border rounded-lg",
      },
    },
    content: "<p>Start typing here...</p>",
  });

  return (
    <div className="p-11 flex flex-col h-screen prose max-w-none p-4 focus:outline-none min-h-[300px] border rounded-lg">
      <EditorContent editor={editor} className="tiptap-editor min-h-[300px]" />
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div>
      <Link href={ROUTE_NAMES.MemberProgram}>
        <Button>To Program</Button>
      </Link>
      <h2>Dashboard Editor</h2>
      <CustomEditor />
    </div>
  );
}
