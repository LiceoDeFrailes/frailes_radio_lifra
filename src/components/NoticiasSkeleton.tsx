import { Skeleton } from "@/components/ui/skeleton";

export default function NoticiasSkeleton() {
  // Mostramos varios placeholders (simulan las noticias)
  const items = Array(4).fill(0);

  return (
    <div className="flex flex-col gap-4 p-4">
      {items.map((_, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-start md:items-center gap-4 border rounded-xl p-4 shadow-sm"
        >
          {/* Imagen */}
          <Skeleton className="w-full md:w-60 h-40 rounded-lg" />

          {/* Contenido de texto */}
          <div className="flex flex-col flex-1 gap-3">
            <Skeleton className="h-6 w-32" /> {/* Título */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
