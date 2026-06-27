"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
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
import Editor from "@/components/Editor";
import { updateNoticia, updateNoticiaImage } from "@/lib/actions/general.actions";
import { sanitizeHtml } from "@/lib/sanitize";

export default function NoticiaEditDialog({
  item,
  open,
  onOpenChange,
  onSaved,
  mode = "admin",
}: EditDialogProps) {  const MAX_FILE_SIZE = 3 * 1024 * 1024;

  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [content, setContent] = useState(item?.content ?? "");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setDescription(item?.description ?? "");
      setContent(item?.content ?? "");
      setNewImage(null);
      setImagePreview(null);
      setErrors({});
      setShowPreview(true);
    }
  }, [open, item]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        image: "La imagen supera el tamaño máximo de 3 MB",
      }));
      e.target.value = "";
      return;
    }

    setNewImage(file);
    const reader = new FileReader();
    reader.onload = (ev) =>
      setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
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

    const plainContent = content.replace(/<[^>]*>/g, "").trim();
    if (!plainContent) {
      newErrors.content = "El contenido es obligatorio";
    } else if (plainContent.length < 10) {
      newErrors.content = "El contenido debe tener al menos 10 caracteres";
    }

    if (newImage && newImage.size > MAX_FILE_SIZE) {
      newErrors.image = "La imagen supera el tamaño máximo de 3 MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (approve: boolean) => {
    if (!validate()) return;
    setSaving(true);

    let finalImageUrl = item?.imageUrl as string | undefined;

    if (newImage) {
      const imageResult = await updateNoticiaImage(
        item.id,
        newImage,
        item.imageUrl ?? "");
      if (!imageResult.ok) {
        setSaving(false);
        toast.error("Error al subir la imagen");
        return;
      }
      finalImageUrl = imageResult.imageUrl;
    }

    const shouldApprove = mode === "admin" ? approve : false;
    const result = await updateNoticia(
      item.id,
      {
        title: title.trim(),
        description: description.trim(),
        content,
        imageUrl: finalImageUrl,
      },
      shouldApprove || undefined
    );
    setSaving(false);
    if (result.ok) {
      toast.success(
        shouldApprove ? "Publicacion aprobada" : "Cambios guardados"
      );
      onSaved(mode === "admin" ? approve : undefined);
      onOpenChange(false);
    } else {
      toast.error("Error al guardar los cambios");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Noticia</DialogTitle>
          <DialogDescription>
            {mode === "admin"
              ? "Modifica los campos y elegi guardar o aprobar directamente."
              : "Modifica los campos y guarda los cambios. La publicacion seguira pendiente de aprobacion."}
          </DialogDescription>
        </DialogHeader>

        {/* Preview toggle */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Ocultar vista previa" : "Ver vista previa"}
          </Button>
        </div>

        {showPreview && (
          <div className="space-y-3 rounded-md border p-4 bg-muted/30">
            <p className="text-xs text-muted-foreground font-medium">Vista previa actual</p>
            {item?.imageUrl && (
              <div className="relative w-full h-48 rounded-md overflow-hidden">
                <Image src={item.imageUrl} alt="Preview" fill className="object-cover" />
              </div>
            )}
            {content && (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
              />
            )}
            {!content && !item?.imageUrl && (
              <p className="text-sm text-muted-foreground">Sin contenido para previsualizar.</p>
            )}
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="n-image">Imagen</Label>
            <Input
              id="n-image"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Tamaño máximo: 3 MB. Formatos: JPG o PNG.
            </p>
            {newImage && imagePreview && (
              <div className="relative w-full h-48 rounded-md overflow-hidden mt-2">
                <img
                  src={imagePreview}
                  alt="Nueva imagen"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="n-title">Título *</Label>
            <Input
              id="n-title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: "" })); }}
              placeholder="Título de la noticia"
              disabled={saving}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="n-desc">Descripción *</Label>
              <span className="text-xs text-muted-foreground">{description.length}/300</span>
            </div>
            <Textarea
              id="n-desc"
              value={description}
              onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: "" })); }}
              placeholder="Breve descripción"
              rows={2}
              disabled={saving}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label>Contenido *</Label>
            {open && (
              <Editor key={item?.id || "editor"} onChange={(val) => { setContent(val); if (errors.content) setErrors(prev => ({ ...prev, content: "" })); }} initialContent={item?.content} />
            )}
            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
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
