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
  uploadImage: (
    file: File
  ) => Promise<{ url: string | null; storageId: string }>
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
                    uploadImage(file)
                      .then(({ url, storageId }) => {
                        // Create an image node with the uploaded URL
                        const node = view.state.schema.nodes.image.create({
                          src: url,
                          id: storageId,
                        });
                        // update the view
                        const transaction =
                          view.state.tr.replaceSelectionWith(node);
                        view.dispatch(transaction);
                      })
                      .catch((error: Error) => {
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
  const generateUploadUrl = useMutation(api.fromImages.generateUploadUrl);
  const deleteImage = useMutation(api.fromImages.deleteImage);
  const getImageURL = useMutation(api.fromImages.getImageURL);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
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
                const imageStoreId = node.attrs.id;
                console.log("Image deleted:", node.attrs, imageStoreId, node);

                deleteImage({
                  storageId: imageStoreId as Id<"_storage">,
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
