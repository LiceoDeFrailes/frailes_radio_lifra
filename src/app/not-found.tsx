import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, SearchX } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center"
        >
          {/* Escudo */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-Dark-Green-Lifra shadow-lg">
              <Image
                src="/escudoFrailes.webp"
                alt="Escudo Liceo de Frailes"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Icono 404 */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-Dark-Green-Lifra/10 flex items-center justify-center">
              <SearchX className="w-10 h-10 text-Dark-Green-Lifra" />
            </div>
          </div>

          {/* Código 404 */}
          <h1 className="text-8xl font-bold text-slate-900 mb-2">
            404
          </h1>

          {/* Título */}
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Página no encontrada
          </h2>

          {/* Descripción */}
          <p className="text-slate-600 mb-8 leading-relaxed">
            Lo sentimos, la página que buscás no existe o fue movida. 
            Verificá la dirección o volvé al inicio para seguir navegando.
          </p>

          {/* Botón CTA */}
          <Button
            size="lg"
            className="bg-Dark-Green-Lifra hover:bg-Light-Green-Lifra text-white hover:text-slate-900 font-semibold shadow-lg transition-all duration-300"
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Volver al Inicio
            </Link>
          </Button>

          {/* Links secundarios */}
          <div className="mt-8 flex justify-center gap-6 text-sm">
            <Link
              href="/sobreNosotros"
              className="text-slate-500 hover:text-Dark-Green-Lifra transition-colors"
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contacto"
              className="text-slate-500 hover:text-Dark-Green-Lifra transition-colors"
            >
              Contacto
            </Link>
            <Link
              href="/radioLifra"
              className="text-slate-500 hover:text-Dark-Green-Lifra transition-colors"
            >
              RadioLifra
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
