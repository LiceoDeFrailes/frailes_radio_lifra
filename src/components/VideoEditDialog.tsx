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
}: EditDialogProps) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setDescription(item?.description ?? "");
      setUrl(item?.url ?? "");
      setTitleError("");
    }
  }, [open, item]);

  const validate = (): boolean => {
    if (!title.trim()) {
      setTitleError("El título es obligatorio");
      return false;
    }
    if (!url.trim()) {
      toast.error("La URL es obligatoria");
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleSave = async (approve: boolean) => {
    if (!validate()) return;
    setSaving(true);
    const result = await updateVideo(
      item.id,
      { title: title.trim(), description: description.trim(), url: url.trim() },
      approve
    );
    setSaving(false);
    if (result.ok) {
      toast.success(approve ? "Video aprobado" : "Cambios guardados");
      onSaved(approve);
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
            Modificá los campos y elegí guardar o aprobar directamente.
          </DialogDescription>
        </DialogHeader>

        {/* Preview */}
        {url && (
          <div className="rounded-md border overflow-hidden">
            <iframe
              src={url}
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
              onChange={(e) => { setTitle(e.target.value); setTitleError(""); }}
              placeholder="Título del video"
              disabled={saving}
            />
            {titleError && <p className="text-sm text-destructive">{titleError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="v-desc">Descripción</Label>
            <Textarea
              id="v-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción"
              rows={2}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="v-url">URL *</Label>
            <Input
              id="v-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              disabled={saving}
            />
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
          <Button
            type="button"
            className="bg-Dark-Green-Lifra hover:bg-Dark-Green-Lifra/90 text-white"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving && <Spinner className="mr-2" />}
            Guardar y Aprobar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
