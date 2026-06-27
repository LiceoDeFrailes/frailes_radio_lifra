"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { updateGaleria, updateGaleriaImages } from "@/lib/actions/general.actions";

export default function GaleriaEditDialog({
  item,
  open,
  onOpenChange,
  onSaved,
  mode = "admin",
}: EditDialogProps) {  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const MAX_IMAGES = 6;

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setDescription(item?.description ?? "");
      setNewImages([]);
      setImagePreviews([]);
      setErrors({});
    }
  }, [open, item]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    // Check max images limit
    if (newImages.length + newFiles.length > MAX_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        images: `Solo puedes agregar máximo ${MAX_IMAGES} imágenes.`,
      }));
      e.target.value = "";
      return;
    }

    // Check file sizes
    const oversizedFiles = newFiles.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: "Una o más imágenes superan el tamaño máximo de 3 MB.",
      }));
      e.target.value = "";
      return;
    }

    // Clear errors if valid
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));

    const updatedImages = [...newImages, ...newFiles];
    setNewImages(updatedImages);

    // Create previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImagePreviews((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      newErrors.title = "El título es obligatorio";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres";
    } else if (trimmedTitle.length > 100) {
      newErrors.title = "El título no puede exceder 100 caracteres";
    }

    if (!trimmedDesc) {
      newErrors.description = "La descripción es obligatoria";
    } else if (trimmedDesc.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres";
    } else if (trimmedDesc.length > 300) {
      newErrors.description = "La descripción no puede exceder 300 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (approve: boolean) => {
    if (!validate()) return;
    setSaving(true);

    let finalImageUrls = (item?.imageUrls as string[] | undefined) ?? [];

    if (newImages.length > 0) {
      const imageResult = await updateGaleriaImages(
        item.id,
        newImages,
        finalImageUrls);
      if (!imageResult.ok) {
        setSaving(false);
        toast.error("Error al subir las imagenes");
        return;
      }
      finalImageUrls = imageResult.imageUrls;
    }

    const shouldApprove = mode === "admin" ? approve : false;
    const result = await updateGaleria(
      item.id,
      {
        title: title.trim(),
        description: description.trim(),
        imageUrls: finalImageUrls,
      },
      shouldApprove || undefined
    );
    setSaving(false);
    if (result.ok) {
      toast.success(
        shouldApprove ? "Galeria aprobada" : "Cambios guardados"
      );
      onSaved(mode === "admin" ? approve : undefined);
      onOpenChange(false);
    } else {
      toast.error("Error al guardar los cambios");
    }
  };

  const images = item?.imageUrls as string[] | undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Galería</DialogTitle>
          <DialogDescription>
            {mode === "admin"
              ? "Modifica los campos y elegi guardar o aprobar directamente."
              : "Modifica los campos y guarda los cambios. La galeria seguira pendiente de aprobacion."}
          </DialogDescription>
        </DialogHeader>

        {/* Replace images */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="g-images">Reemplazar imágenes</Label>
            <Input
              id="g-images"
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleImageChange}
              disabled={saving || newImages.length >= MAX_IMAGES}
            />
            <p className="text-xs text-muted-foreground">
              Máximo {MAX_IMAGES} imágenes. Tamaño máximo por imagen: 3 MB.
              Formatos: JPG o PNG.
            </p>
            {errors.images && (
              <p className="text-sm text-destructive">{errors.images}</p>
            )}
            {newImages.length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {newImages.length} imagen(es) seleccionada(s)
              </p>
            )}
          </div>

          {/* New image previews */}
          {imagePreviews.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                Nuevas imágenes
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative group border rounded-lg bg-gray-50"
                  >
                    <div className="p-2">
                      <img
                        src={preview}
                        alt={`Nueva imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute rounded-full -top-2 -right-2 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity"
                      onClick={() => removeImage(index)}
                      disabled={saving}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="p-2 pt-0 text-xs text-gray-500">
                      <p className="truncate">{newImages[index]?.name}</p>
                      <p>
                        {((newImages[index]?.size ?? 0) / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Old images (shown when not replacing) */}
          {newImages.length === 0 && images && images.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                Imágenes actuales
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative min-w-[120px] h-[90px] rounded-md overflow-hidden shrink-0 border"
                  >
                    <img
                      src={img}
                      alt={`Imagen ${i + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when no images at all */}
          {newImages.length === 0 && (!images || images.length === 0) && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                No hay imágenes seleccionadas
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="g-title">Título *</Label>
            <Input
              id="g-title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: "" })); }}
              placeholder="Título de la galería"
              disabled={saving}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="g-desc">Descripción *</Label>
              <span className="text-xs text-muted-foreground">{description.length}/300</span>
            </div>
            <Textarea
              id="g-desc"
              value={description}
              onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: "" })); }}
              placeholder="Breve descripción"
              rows={3}
              disabled={saving}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={saving}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving && <Spinner className="mr-2" />}
            Guardar Cambios
          </Button>
          {mode === "admin" && (
            <Button
              type="button"
              className="bg-Dark-Green-Lifra hover:bg-Dark-Green-Lifra/90 text-white"
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              {saving && <Spinner className="mr-2" />}
              Guardar y Aprobar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
