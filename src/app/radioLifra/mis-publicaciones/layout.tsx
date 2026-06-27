"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { FileEdit, CheckCircle } from "lucide-react";

const tabs = [
  {
    label: "En revision",
    href: "/radioLifra/mis-publicaciones/en-revision",
    icon: FileEdit,
  },
  {
    label: "Aprobadas",
    href: "/radioLifra/mis-publicaciones/aprobadas",
    icon: CheckCircle,
  },
];

export default function MisPublicacionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "estudiante") {
      router.push("/radioLifra");
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (!user || user.role !== "estudiante") return null;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Mis Publicaciones</h1>

      <div className="flex gap-1 border-b mb-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const IconComponent = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                isActive
                  ? "border-Dark-Green-Lifra text-Dark-Green-Lifra"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              )}
            >
              <IconComponent className="size-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
