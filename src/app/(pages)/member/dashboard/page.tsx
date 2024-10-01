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

const CustomImagePaste = Extension.create({
  name: "customImagePaste",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("customImagePaste"),
        props: {
          handlePaste: (view: EditorView, event: ClipboardEvent) => {
            const items = Array.from(event.clipboardData?.items || []);

            for (const item of items) {
              if (item.type.indexOf("image") === 0) {
                event.preventDefault();
                const blob = item.getAsFile();

                if (blob) {
                  const reader = new FileReader();

                  reader.onload = (e: ProgressEvent<FileReader>) => {
                    const base64Image = e.target?.result;

                    if (typeof base64Image === "string") {
                      console.log("base64Image", base64Image);

                      const node = view.state.schema.nodes.image.create({
                        src: base64Image,
                      });

                      const transaction =
                        view.state.tr.replaceSelectionWith(node);

                      view.dispatch(transaction);

                      console.log("transaction", transaction);
                    }
                  };

                  reader.readAsDataURL(blob);
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

const CustomEditor = () => {
  const uploadImage = useMutation("uploadImage");
  const deleteImage = useMutation("deleteImage");

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
    onCreate: ({ editor }) => {
      editor.on("update", ({ editor, transaction }) => {
      
        if (transaction.docChanged) {
          const deletedNodes = transaction.steps.filter(
            (step) => step.slice && step.slice.content.size === 0
          );
          deletedNodes.forEach((step) => {
            const { from, to } = step as any;
            const deletedContent = transaction.docs[0].slice(from, to);
            deletedContent.content.forEach((node) => {
              if (node.type.name === "image") {
                const imageUrl = node.attrs.src;
                console.log("Image deleted:", imageUrl);
                // Call the deleteImage mutation to remove the image from storage
                deleteImage({ imageUrl }).catch((error) => {
                  console.error("Failed to delete image from storage:", error);
                });
              }
            });
          });
        }
      });
    },
  });

  return (
    <div className="p-11 flex flex-col h-screen prose max-w-none p-4 focus:outline-none min-h-[300px] border rounded-lg">
      <EditorContent editor={editor} className="tiptap-editor min-h-[300px]" />
      <p className="mt-4">
        You can now paste images directly into the editor! Deleted images will
        be removed from storage.
      </p>
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
