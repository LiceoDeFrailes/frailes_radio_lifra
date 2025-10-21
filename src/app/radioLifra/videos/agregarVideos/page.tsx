"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { uploadVideo } from "@/lib/actions/general.actions";
import { useRouter } from "next/navigation";

export default function AgregarVideoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urlYouTube, setUrlYouTube] = useState("");

  useEffect(() => {
    if (!user || user.role !== "estudiante") {
      toast.info("Nivel de Acceso Prohibido");
      return router.push("/radioLifra");
    }
  }, []);
  
  function isYouTubeVideoURL(url: string) {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(\?.*)?$/;
    return regex.test(url);
  }
  const getEmbedUrl = (url: string) => {
    return url.replace("youtu.be", "www.youtube.com/embed");
  };

  const handlePublish = async () => {
    if (!user)
      return toast.info("Debes iniciar sesión para publicar una video.");
    if (user.role !== "estudiante")
      return toast.info("Solo los estudiantes pueden publicar videos.");
    if (!author || !title || !urlYouTube || !description)
      return toast.info("Por favor completa todos los campos.");
    if (!isYouTubeVideoURL(urlYouTube))
      return toast.info("La procedencia de la URL debe ser de YouTube");
    const toastId = toast.custom(
      (t) => (
        <div className="flex gap-2 justify-center items-center bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100">
          <Spinner className="w-4 h-4 text-Light-Green-Lifra" />
          <h1 className="text-gray-700 font-medium">Cargando</h1>
        </div>
      ),
      { duration: Infinity }
    );

    const url = await getEmbedUrl(urlYouTube);
    const res = await uploadVideo({ user, author, title, url, description });
    if (res.ok) {
      toast.dismiss(toastId);
      toast.success(
        "Video enviado correctamente. Espera aprobación del administrador."
      );
      setAuthor("");
      setTitle("");
      setUrlYouTube("");
      setDescription("");
    } else {
      console.error("Error al publicar video:", res.error);
      toast.dismiss(toastId);
      toast.error("Ocurrió un error al publicar el Video.");
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto mt-20">
      <div className="bg-white shadow rounded-2xl p-6 flex flex-col gap-6">
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
              Titulo del Video
            </label>
            <Input
              placeholder="Ingrese el Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL del Video
            </label>
            <Input
              placeholder="https://youtu.be/MJR3YbsJ5o..."
              value={urlYouTube}
              onChange={(e) => setUrlYouTube(e.target.value)}
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
          <div className="flex flex-row gap-2">
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
    </div>
  );
}
