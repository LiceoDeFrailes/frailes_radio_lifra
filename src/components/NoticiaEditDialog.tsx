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
import { updateNoticia } from "@/lib/actions/general.actions";

export default function NoticiaEditDialog({
  item,
  open,
  onOpenChange,
  onSaved,
}: EditDialogProps) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [content, setContent] = useState(item?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setDescription(item?.description ?? "");
      setContent(item?.content ?? "");
      setTitleError("");
      setShowPreview(true);
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
    const result = await updateNoticia(
      item.id,
      { title: title.trim(), description: description.trim(), content },
      approve
    );
    setSaving(false);
    if (result.ok) {
      toast.success(approve ? "Publicación aprobada" : "Cambios guardados");
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
          <DialogTitle>Editar Noticia</DialogTitle>
          <DialogDescription>
            Modificá los campos y elegí guardar o aprobar directamente.
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
                dangerouslySetInnerHTML={{ __html: content }}
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
            <Label htmlFor="n-title">Título *</Label>
            <Input
              id="n-title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(""); }}
              placeholder="Título de la noticia"
              disabled={saving}
            />
            {titleError && <p className="text-sm text-destructive">{titleError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="n-desc">Descripción</Label>
            <Textarea
              id="n-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción"
              rows={2}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label>Contenido</Label>
            {open && (
              <Editor key={item?.id || "editor"} onChange={setContent} initialContent={item?.content} />
            )}
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
