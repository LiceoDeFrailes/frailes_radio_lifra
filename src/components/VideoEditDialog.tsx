"use client";

import React, { useState, useEffect } from "react";
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
import { updateVideo } from "@/lib/actions/general.actions";

export default function VideoEditDialog({
  item,
  open,
  onOpenChange,
  onSaved,
  mode = "admin",
}: EditDialogProps) {  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setDescription(item?.description ?? "");
      setUrl(item?.url ?? "");
      setErrors({});
    }
  }, [open, item]);

  const isYouTubeVideoURL = (url: string) => {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(\?.*)?$/;
    return regex.test(url);
  };

  const getEmbedUrl = (url: string) => {
    return url.replace("youtu.be", "www.youtube.com/embed");
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    const trimmedUrl = url.trim();

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

    if (!trimmedUrl) {
      newErrors.url = "La URL es obligatoria";
    } else if (!isYouTubeVideoURL(trimmedUrl)) {
      newErrors.url = "Ingresá una URL válida de YouTube (ej: https://www.youtube.com/watch?v=... o https://youtu.be/...)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (approve: boolean) => {
    if (!validate()) return;
    setSaving(true);
    const shouldApprove = mode === "admin" ? approve : false;
    const embedUrl = getEmbedUrl(url.trim());
    const result = await updateVideo(
      item.id,
      { title: title.trim(), description: description.trim(), url: embedUrl },
      shouldApprove || undefined
    );
    setSaving(false);
    if (result.ok) {
      toast.success(shouldApprove ? "Video aprobado" : "Cambios guardados");
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
          <DialogTitle>Editar Video</DialogTitle>
          <DialogDescription>
            {mode === "admin"
              ? "Modifica los campos y elegi guardar o aprobar directamente."
              : "Modifica los campos y guarda los cambios. El video seguira pendiente de aprobacion."}
          </DialogDescription>
        </DialogHeader>

        {/* Preview */}
        {url && isYouTubeVideoURL(url) && (
          <div className="rounded-md border overflow-hidden">
            <iframe
              src={getEmbedUrl(url)}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full min-h-[190px]"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="v-title">Título *</Label>
            <Input
              id="v-title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: "" })); }}
              placeholder="Título del video"
              disabled={saving}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="v-desc">Descripción *</Label>
              <span className="text-xs text-muted-foreground">{description.length}/300</span>
            </div>
            <Textarea
              id="v-desc"
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
            <Label htmlFor="v-url">URL *</Label>
            <Input
              id="v-url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (errors.url) setErrors(prev => ({ ...prev, url: "" })); }}
              placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
              disabled={saving}
              className={errors.url ? "border-destructive" : ""}
            />
            {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
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
