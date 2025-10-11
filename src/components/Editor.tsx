"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { Placeholder } from "@tiptap/extension-placeholder";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListOrdered, List } from "lucide-react";

export default function Editor({
  onChange,
  reset,
}: {
  onChange: (html: string) => void;
  reset?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configuración específica si es necesaria
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-outside ml-4",
          },
        },
      }),
      TextStyle,
      FontFamily.configure({ 
        types: ["textStyle"] 
      }),
      Underline,
      Color.configure({
        types: ['textStyle'],
      }),
      Placeholder.configure({
        placeholder: "Escribe Aqui...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) onChange(html);
    },
  });

  // 🔁 Reset del contenido
  useEffect(() => {
    if (reset && editor) {
      editor.commands.clearContent(true);
      editor.chain().focus().run();
    }
  }, [reset, editor]);

  if (!editor) return null;

  return (
    <div className="w-full border rounded-md">
      {/* 🧭 Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b p-2">
        <Select
          onValueChange={(font) =>
            editor.chain().focus().setFontFamily(font).run()
          }
        >
          <SelectTrigger className="w-28 h-8 text-sm">
            <SelectValue placeholder="Roboto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Roboto">Roboto</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          </SelectContent>
        </Select>

        {/* Negrita */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          <b>B</b>
        </Button>

        {/* Cursiva */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          <i>I</i>
        </Button>

        {/* Subrayado */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-gray-200" : ""}
        >
          <u>U</u>
        </Button>

        {/* Lista con viñetas */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
        >
          <List className="h-4 w-4" />
        </Button>

        {/* Lista numerada */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* ✏️ Contenido */}
      <div className="min-h-[200px] p-4">
        <EditorContent 
          editor={editor} 
          className="prose max-w-none h-full focus:outline-none" 
        />
      </div>
    </div>
  );
}