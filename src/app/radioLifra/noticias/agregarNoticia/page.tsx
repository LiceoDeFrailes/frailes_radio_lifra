// app/radioLifra/noticias/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Editor from "@/components/Editor";
import Link from "next/link"

export default function NuevaNoticiaPage() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [content, setContent] = useState(""); // 👈 aquí guardamos el HTML del editor

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handlePublish = () => {
    console.log({
      author,
      title,
      description,
      content,
      images,
    });
    alert("Noticia publicada 🚀");
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto mt-20">
      <div className="bg-white shadow rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Autor
            </label>
            <Input
              placeholder="Ingrese el Nombre"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titulo de la Noticia
            </label>
            <Input
              placeholder="Ingrese el Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breve descripcion
            </label>
            <Textarea
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agrega tu imágen
            </label>
            <Input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Columna derecha con Editor */}
        <Editor />
<div className="flex mt-6 gap-4">
  <Button
    className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra text-white flex-1 min-w-0 py-3 text-base font-medium"
    onClick={handlePublish}
  >
    Publicar
  </Button>
  <Link href="/radioLifra" className="flex-1">
    <Button 
      variant="destructive" 
      className="w-full min-w-0 py-3 text-base font-medium"
    >
      Cancelar
    </Button>
  </Link>
</div>
      </div>
    </div>
  );
}
