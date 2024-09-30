import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface EditorToolsProps {
  editor: Editor | null;
  title: string;
  lessonCode: string;
}

export const EditorTools: React.FC<EditorToolsProps> = ({
  editor,
  title = "",
  lessonCode,
}) => {
  if (!editor) {
    return null;
  }

  const uploadCourseData = useMutation(api.fromLessons.uploadCourseData);
  const deleteLessonByLessonCode = useMutation(
    api.fromLessons.deleteLessonByLessonCode
  );

  const [inputTitle, setInputTitle] = useState(title);
  const [inputLessonCode, setInputLessonCode] = useState(lessonCode);

  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const onClickSaveLessonContent = async () => {
    if (!inputLessonCode || !editor) {
      throw new Error(
        "No Selected Lesson Id Provided or Editor not initialized"
      );
    }

    const json = editor.getJSON();

    try {
      console.log("inputLessonCode", inputLessonCode);
      const result = await uploadCourseData({
        lessonCode: inputLessonCode,
        content: json,
        title: inputTitle, // Now using the title state
      });
      console.log(result);
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const onClickDelete = async () => {
    if (!inputLessonCode || !editor) {
      throw new Error(
        "No Selected Lesson Id Provided or Editor not initialized"
      );
    }

    try {
      const result = await deleteLessonByLessonCode({
        lessonCode: inputLessonCode,
      });
      console.log(result);
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const handleTitleChange = (value: string) => {
    setInputTitle(value);
  };

  const handleLessonCodeChange = (value: string) => {
    setInputLessonCode(value);
  };

  return (
    <>
      <div className="mb-4 space-y-2">
        <Input
          type="text"
          placeholder="Title"
          value={inputTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Lesson Code"
          value={inputLessonCode}
          onChange={(e) => handleLessonCodeChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="bg-gray-100 p-2 flex flex-wrap gap-2 mb-4 rounded-lg">
        <Button variant="outline" onClick={onClickSaveLessonContent}>
          Save to Convex
        </Button>
        <Button variant="destructive" onClick={onClickDelete}>
          Delete
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-gray-200" : ""}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-gray-200" : ""}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "bg-gray-200" : ""}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
          }
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
