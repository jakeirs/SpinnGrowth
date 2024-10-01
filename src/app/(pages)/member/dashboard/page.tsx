"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTE_NAMES } from "../../routes";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useMutation } from "../../convex/_generated/react";

const CustomEditor = () => {
  const uploadImage = useMutation("uploadImage");

  const CustomImagePaste = Extension.create({
    name: 'customImagePaste',

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('customImagePaste'),
          props: {
            handlePaste: (view: EditorView, event: ClipboardEvent) => {
              const items = Array.from(event.clipboardData?.items || []);
              for (const item of items) {
                if (item.type.indexOf("image") === 0) {
                  event.preventDefault();
                  const blob = item.getAsFile();
                  if (blob) {
                    handleImageUpload(view, blob);
                  }
                  return true;
                }
              }
              return false;
            },
          },
        }),
      ];
    },
  });

  const handleImageUpload = async (view: EditorView, blob: File) => {
    try {
      // Convert blob to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(blob);
      });

      // Upload image to storage
      const imageUrl = await uploadImage({ image: base64Image });

      // Insert the uploaded image URL into the editor
      const node = view.state.schema.nodes.image.create({ src: imageUrl });
      const transaction = view.state.tr.replaceSelectionWith(node);
      view.dispatch(transaction);
    } catch (error) {
      console.error("Failed to upload image:", error);
      // Optionally, you can show an error message to the user here
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      CustomImagePaste,
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
      <p className="mt-4">You can now paste images directly into the editor. They will be uploaded to storage automatically!</p>
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
