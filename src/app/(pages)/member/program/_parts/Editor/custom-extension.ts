import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/react";
import { Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Transaction } from "@tiptap/pm/state";
import { Id } from "@/convex/_generated/dataModel";
import { Step } from "prosemirror-transform";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      storageId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-storage-id"),
        renderHTML: (attributes) => {
          if (!attributes.storageId) {
            return {};
          }
          return {
            "data-storage-id": attributes.storageId,
          };
        },
      },
    };
  },
});

export const createCustomImagePaste = (
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
                        // Create an image node with the uploaded URL and storageId
                        const nodeToCreate =
                          view.state.schema.nodes.image.create({
                            src: url,
                            storageId,
                          });

                        const transaction =
                          view.state.tr.replaceSelectionWith(nodeToCreate);
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
/**
 * mutation from convex
 */
type DeleteImageFunction = (args: {
  storageId: Id<"_storage">;
}) => Promise<any>;

export const onEditDeleteImageFromStorageConvex = ({
  transaction,
  deleteImage,
}: {
  transaction: Transaction;
  deleteImage: DeleteImageFunction;
}) => {
  if (transaction.docChanged) {
    const deletedNodes = transaction.steps.filter((step: Step) => {
      return "slice" in step && (step as any).slice.content.size === 0;
    });
    /** delete nodes from <Editor />*/
    deletedNodes.forEach((step: Step) => {
      const { from, to } = step as any;
      const deletedContent = transaction.docs[0].slice(from, to);

      deletedContent.content.forEach((node: any) => {
        if (node.type.name === "image") {
          const imageStoreId = node.attrs.storageId;
          /**Delete from convex */
          deleteImage({
            storageId: imageStoreId as Id<"_storage">,
          }).catch((error: Error) => {
            console.error("Failed to DELETE image from storage:", error);
          });
        }
      });
    });
  }
};
