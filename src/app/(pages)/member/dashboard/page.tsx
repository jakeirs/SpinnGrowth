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
import { Step } from "prosemirror-transform";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const createCustomImagePaste = (
  uploadImage: (args: { file: File }) => Promise<string>
) => {
  return Extension.create({
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
                  const file = item.getAsFile();

                  if (file) {
                    // Use the uploadImage mutation to upload the file
                    uploadImage({ file })
                      .then((imageUrl) => {
                        // Create an image node with the uploaded URL
                        const node = view.state.schema.nodes.image.create({
                          src: imageUrl,
                        });

                        const transaction =
                          view.state.tr.replaceSelectionWith(node);
                        view.dispatch(transaction);
                      })
                      .catch((error) => {
                        console.error("Failed to upload image:", error);
                      });

                    return true;
                  }
                }
              }
              return false;
            },
          },
        }),
      ];
    },
  });
};

const CustomEditor = () => {
  const uploadImage = useMutation(api.fromImages.generateUploadUrl);
  const deleteImage = useMutation(api.fromImages.deleteImage);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      createCustomImagePaste(uploadImage),
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
          const deletedNodes = transaction.steps.filter((step: Step) => {
            return "slice" in step && (step as any).slice.content.size === 0;
          });
          
          deletedNodes.forEach((step: Step) => {
            const { from, to } = step as any;
            const deletedContent = transaction.docs[0].slice(from, to);

            deletedContent.content.forEach((node: any) => {
              if (node.type.name === "image") {
                const imageUrl = node.attrs.src;
                console.log("Image deleted:", imageUrl);

                deleteImage({
                  storageId:
                    "kg253mf28yfajj1m1dtayd2cg571rhyy" as Id<"_storage">,
                }).catch((error: Error) => {
                  console.error("Failed to DELETE image from storage:", error);
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
