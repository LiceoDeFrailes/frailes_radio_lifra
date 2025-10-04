"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import FontFamily from "@tiptap/extension-font-family"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      Bold,
      Italic,
      Underline,
    ],
    content: "Escribe Aquí...",
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div className="w-full border rounded-md">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b p-2 ">


        {/* Fuente */}
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

        {/* Botones de formato */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          <b>B</b>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          <i>I</i>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-gray-200" : ""}
        >
          <u>U</u>
        </Button>
      </div>

      {/* Editor */}
      <div className="min-h-[200px]">
        <EditorContent editor={editor} className="h-full m-1"/>
      </div>
      
    </div>
  )
}
