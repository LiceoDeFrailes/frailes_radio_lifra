"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Eye, FileText, Video, Image, Podcast } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  noticia: { label: "Noticia", icon: FileText },
  video: { label: "Video", icon: Video },
  galeria: { label: "Galeria", icon: Image },
  podcast: { label: "Podcast", icon: Podcast },
};

const TYPE_COLORS: Record<string, string> = {
  noticia: "bg-blue-100 text-blue-800",
  video: "bg-red-100 text-red-800",
  galeria: "bg-purple-100 text-purple-800",
  podcast: "bg-orange-100 text-orange-800",
};

function formatDate(timestamp: any): string {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function StudentPublicationCard({
  item,
  onEdit,
  readOnly = false,
  publicUrl,
}: {
  item: PublicacionBase;
  onEdit?: () => void;
  readOnly?: boolean;
  publicUrl?: string;
}) {
  const tipo = item.tipo as string;
  const config = TYPE_CONFIG[tipo] ?? { label: tipo, icon: FileText };
  const colorClass = TYPE_COLORS[tipo] ?? "bg-gray-100 text-gray-800";
  const IconComponent = config.icon;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className={cn("text-xs", colorClass)}>
                <IconComponent className="size-3 mr-1" />
                {config.label}
              </Badge>
              {item.createdAt && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.createdAt)}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold truncate">
              {item.title || "Sin titulo"}
            </h3>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            {!readOnly && onEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="size-4 mr-1" />
                Editar
              </Button>
            )}
            {readOnly && publicUrl && (
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={publicUrl}>
                  <Eye className="size-4 mr-1" />
                  Ver detalle
                </Link>
              </Button>
            )}
          </div>
        </div>

        {item.nameAuthor && (
          <p className="text-xs text-muted-foreground mt-2">
            Autor: {item.nameAuthor}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
