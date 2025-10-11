"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { uploadGaleria } from "@/lib/actions/general.actions";
import { Spinner } from "@/components/ui/spinner";
import { X, Image as ImageIcon, Plus } from "lucide-react";

export default function NuevaGaleriaPage() {
  const { user } = useAuth();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // (3 MB)
  const MAX_IMAGES = 6;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    
    // aqui verificar si se excede el límite
    if (images.length + newFiles.length > MAX_IMAGES) {
      toast.info(`Solo puedes agregar máximo ${MAX_IMAGES} imágenes.`);
      e.target.value = "";
      return;
    }

    // aqui verificar tamaño de cada archivo
    const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast.info('Una o más imágenes superan el tamaño máximo permitido de 3 MB.');
      e.target.value = "";
      return;
    }

    // Agregar nuevos archivos
    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);

    // Crear previews de las nuevas imágenes
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Resetear el input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handlePublish = async () => {
    if (!user) return toast.info('Debes iniciar sesión para publicar una noticia.');
    if (user.role !== "estudiante") return toast.info('Solo los estudiantes pueden publicar noticias.');
    if (!author || !title || !description || images.length === 0) {
      return toast.info("Por favor completa todos los campos.");
    }
    
    const toastId = toast.custom((t) => (
      <div className="flex gap-2 justify-center items-center bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100">
        <Spinner className="w-4 h-4 text-Light-Green-Lifra" />
        <h1 className="text-gray-700 font-medium">Cargando</h1>
      </div>
    ), { duration: Infinity });
    
    // Convertir File[] a FileList para la función uploadNoticia
    const dataTransfer = new DataTransfer();
    images.forEach(file => dataTransfer.items.add(file));
    const fileList = dataTransfer.files;
    
    const res = await uploadGaleria({user, author, title, description, images: fileList});
    if(res.ok){
      toast.dismiss(toastId)
      toast.success("Galeria enviada correctamente. Espera aprobación del administrador.");
      setAuthor("");
      setTitle("");
      setDescription("");
      setImages([]);
      setImagePreviews([]);
    }else{
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
              Titulo de la Galeria
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
              Agrega tus imágenes ({images.length}/{MAX_IMAGES})
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                multiple
                disabled={images.length >= MAX_IMAGES}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-2">
              Máximo {MAX_IMAGES} imágenes. Tamaño máximo por imagen: 3 MB. Formatos: JPG o PNG.
            </p>
            {images.length > 0 && (
              <p className="text-xs text-green-600 mt-1 ml-2">
                {images.length} imagen(es) seleccionada(s)
              </p>
            )}
          </div>
        </div>

        {/* Columna derecha - Vista previa de imágenes */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <p className="text-md font-semibold text-gray-800">
              Vista previa de imágenes
            </p>
            <span className="text-sm text-gray-500">
              {images.length}/{MAX_IMAGES}
            </span>
          </div>
          
          {imagePreviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] lg:max-h-[400px] overflow-y-auto p-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group border rounded-lg bg-gray-50">
                  <div className="p-3">
                    <img 
                      src={preview} 
                      alt={`Vista previa ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute rounded-4xl -top-2 -right-2 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="p-3 pt-0 text-xs text-gray-500">
                    <p className="truncate">{images[index]?.name}</p>
                    <p>{(images[index]?.size || 0) / 1024 / 1024} MB</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 h-64 flex flex-col items-center justify-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                No hay imágenes seleccionadas
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Las imágenes aparecerán aquí después de seleccionarlas
              </p>
            </div>
          )}
        </div>

        <div className="flex mt-6 gap-4 md:col-span-2">
          <Button
            className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra text-white flex-1 min-w-0 py-3 text-base font-medium"
            onClick={handlePublish}
            disabled={images.length === 0}
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