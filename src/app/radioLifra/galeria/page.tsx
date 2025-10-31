"use client";

import React from "react";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import GaleriaCard from "@/components/GaleriaCard";
import { useEffect, useState } from "react";
import { getGalerias } from "@/lib/actions/general.actions";

const AgregarGaleria = () => {
  const { user } = useAuth();
  const [galerias, setGalerias] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState(false);

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
    }
    fetchGalerias();
  }, []);
  return (
    <div className="flex flex-col gap-3">
      {user?.role === "estudiante" ? (
        <Link href="/radioLifra/galeria/agregarGaleria">
          <CirclePlus className="hover:text-Light-Green-Lifra"/>
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
        <p className="text-gray-500 text-center mt-4">
          No hay galerias disponibles
        </p>
      )}
    </div>
  );
};

export default AgregarGaleria;
