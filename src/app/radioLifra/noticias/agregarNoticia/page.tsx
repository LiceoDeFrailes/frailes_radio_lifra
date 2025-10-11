"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Editor from "@/components/Editor";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { uploadNoticia } from "@/lib/actions/general.actions";
import { Spinner } from "@/components/ui/spinner";

export default function NuevaNoticiaPage() {
  const { user } = useAuth();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [content, setContent] = useState("");
  const [imageKey, setImageKey] = useState(Date.now()); // clave única
  const [resetEditor, setResetEditor] = useState(false);
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // (3 MB)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        toast.info("La imagen supera el tamaño máximo permitido de 3 MB.");
        e.target.value = "";
        setImages(null);
        return;
      }
      setImages(files);
    }
  };

  const handlePublish = async () => {
    if (!user)
      return toast.info("Debes iniciar sesión para publicar una noticia.");
    if (user.role !== "estudiante")
      return toast.info("Solo los estudiantes pueden publicar noticias.");
    if (!author || !title || !description || !content || !images)
      return toast.info("Por favor completa todos los campos.");
    const toastId = toast.custom((t) => (
      <div className="flex gap-2 justify-center items-center bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100">
        <Spinner className="w-4 h-4 text-Light-Green-Lifra" />
        <h1 className="text-gray-700 font-medium">Cargando</h1>
      </div>
    ), { duration: Infinity });
    const res = await uploadNoticia({
      user,
      author,
      title,
      description,
      images,
      content,
    });
    if (res.ok) {
      toast.dismiss(toastId)
      toast.success(
        "Noticia enviada correctamente. Espera aprobación del administrador."
      );
      setAuthor("");
      setTitle("");
      setDescription("");
      setContent("");
      setImages(null);
      setImageKey(Date.now());
      setResetEditor(true);
      setTimeout(() => setResetEditor(false), 0); // permite reutilizar el reset después
    } else {
      console.error("Error al publicar noticia:", res.error);
      toast.dismiss(toastId)
      toast.error("Ocurrió un error al publicar la noticia.");
    }
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
              key={imageKey}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
            />
            <p className="text-xs text-gray-500 mt-1 ml-2">
              Tamaño máximo permitido: 3 MB. Solo imágenes JPG o PNG.
            </p>
          </div>
        </div>

        {/* Columna derecha con Editor */}
        <Editor onChange={(html) => setContent(html)} reset={resetEditor} />
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
      {/* <div className="mt-4 border-t pt-2">
        <h2 className="font-semibold">Vista previa HTML:</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div> */}
    </div>
  );
}
