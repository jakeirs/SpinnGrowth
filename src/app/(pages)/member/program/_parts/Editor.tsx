"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const Editor = ({ isAdmin }: { isAdmin: boolean }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start editing your course content here...</p>",
    editable: isAdmin,
  });

  return (
    <div className="border p-4 rounded-md">
      <EditorContent editor={editor} />
      {!isAdmin && (
        <p className="text-sm text-gray-500 mt-2">
          You need admin privileges to edit this content.
        </p>
      )}
    </div>
  );
};
