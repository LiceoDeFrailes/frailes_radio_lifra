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
import { updateGaleria } from "@/lib/actions/general.actions";

export default function GaleriaEditDialog({
  item,
  open,
  onOpenChange,
  onSaved,
}: EditDialogProps) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setDescription(item?.description ?? "");
      setTitleError("");
    }
  }, [open, item]);

  const validate = (): boolean => {
    if (!title.trim()) {
      setTitleError("El título es obligatorio");
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleSave = async (approve: boolean) => {
    if (!validate()) return;
    setSaving(true);
    const result = await updateGaleria(
      item.id,
      { title: title.trim(), description: description.trim() },
      approve
    );
    setSaving(false);
    if (result.ok) {
      toast.success(approve ? "Galería aprobada" : "Cambios guardados");
      onSaved(approve);
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
            Modificá los campos y elegí guardar o aprobar directamente. Las imágenes no se pueden editar en esta versión.
          </DialogDescription>
        </DialogHeader>

        {/* Preview: image list */}
        {images && images.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Imágenes actuales (solo lectura)</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <div key={i} className="relative min-w-[120px] h-[90px] rounded-md overflow-hidden shrink-0 border">
                  <img src={img} alt={`Imagen ${i + 1}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="g-title">Título *</Label>
            <Input
              id="g-title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(""); }}
              placeholder="Título de la galería"
              disabled={saving}
            />
            {titleError && <p className="text-sm text-destructive">{titleError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="g-desc">Descripción</Label>
            <Textarea
              id="g-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción"
              rows={3}
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
