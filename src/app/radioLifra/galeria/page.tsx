"use client";

import React from "react";
import { PenLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import GaleriaCard from "@/components/GaleriaCard";
import { useEffect, useState } from "react";
import { getGalerias } from "@/lib/actions/general.actions";
import { Spinner } from "@/components/ui/spinner";

const AgregarGaleria = () => {
  const { user } = useAuth();
  const [galerias, setGalerias] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    async function fetchGalerias() {
      const galeriasCollection = await getGalerias();
      setGalerias(galeriasCollection);
      setLoading(false);
    }
    fetchGalerias();
  }, []);
  return (
    <div className="flex flex-col gap-3">
      {user?.role === "estudiante" ? (
        <Link href="/radioLifra/galeria/agregarGaleria">
          <Button className="w-fit gap-2 bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra text-white">
            <PenLine className="size-4" />
            Publicar una galeria
          </Button>
        </Link>
      ) : null}
      {galerias.length > 0 ? (
        galerias.map((g: any) => (
          <GaleriaCard
            key={g.id}
            item={g}
            validationMode={false}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <div className="flex justify-center items-center mt-20">
          {loading && <Spinner className="w-8 h-8 text-Light-Green-Lifra" />}
          <p className="text-gray-500 text-center">
            {loading ? (
              <>Cargando publicaciones...</>
            ) : (
              <>No hay galerías disponibles</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default AgregarGaleria;
