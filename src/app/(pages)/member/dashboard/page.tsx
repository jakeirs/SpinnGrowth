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

const CustomImagePaste = Extension.create({
  name: 'customImagePaste',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("customImagePaste"),
        props: {
          // This function handles the paste event in the editor
          handlePaste: (view: EditorView, event: ClipboardEvent) => {
            // Convert clipboard items to an array for easier processing
            const items = Array.from(event.clipboardData?.items || []);
            
            for (const item of items) {
              // Check if the pasted item is an image
              if (item.type.indexOf("image") === 0) {
                event.preventDefault(); // Prevent default paste behavior
                const blob = item.getAsFile(); // Get the image file as a blob
                
                if (blob) {
                  // Create a new FileReader instance
                  // FileReader is used to read the contents of files (or blobs)
                  const reader = new FileReader();
                  
                  // Set up the onload event handler for the reader
                  // This function will be called when the file is successfully read
                  reader.onload = (e: ProgressEvent<FileReader>) => {
                    const base64Image = e.target?.result;

                    console.log(e)
                    
                    // Check if the result is a string (it should be a base64 encoded image)
                    if (typeof base64Image === "string") {
                      console.log("base64Image", base64Image);
                      
                      // Create a new image node for the editor
                      const node = view.state.schema.nodes.image.create({
                        src: base64Image,
                      });
                      
                      // Create a new transaction to insert the image node
                      const transaction = view.state.tr.replaceSelectionWith(node);
                      
                      // Dispatch the transaction to update the editor's state
                      view.dispatch(transaction);

                      console.log("transaction", transaction);
                    }
                  };
                  
                  // Start reading the blob as a data URL
                  // When complete, this will trigger the onload event above
                  reader.readAsDataURL(blob);
                }
                return true; // Indicate that we've handled this paste event
              }
            }
            return false; // Indicate that we haven't handled this paste event
          },
        },
      }),
    ];
  },
});

const CustomEditor = () => {
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
      <p className="mt-4">You can now paste images directly into the editor!</p>
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
