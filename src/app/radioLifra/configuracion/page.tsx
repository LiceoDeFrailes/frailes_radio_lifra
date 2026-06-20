"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getConfigStats,
  getConfigEquipo,
  getConfigContacto,
  saveConfigStats,
  saveConfigEquipo,
  saveConfigContacto,
} from "@/lib/actions/configuracion.actions";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const LUCIDE_ICONS = [
  "Phone", "Mail", "MapPin", "Clock", "Globe",
  "Facebook", "Instagram", "Youtube", "Camera", "MessageCircle",
];

const emptyMember = (): TeamMember => ({ role: "", name: "", degree: "" });
const emptyContact = (): ContactMethod => ({ icon: "Phone", title: "", content: "", description: "" });

export default function ConfiguracionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<Stat[]>([
    { number: "", label: "" }, { number: "", label: "" }, { number: "", label: "" }, { number: "", label: "" },
  ]);
  const [miembros, setMiembros] = useState<TeamMember[]>([emptyMember()]);
  const [metodos, setMetodos] = useState<ContactMethod[]>([emptyContact()]);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const fotoPreviewRef = useRef<string>("");
  const [saving, setSaving] = useState<"" | "stats" | "equipo" | "contacto">("");
  const [openSection, setOpenSection] = useState<"stats" | "equipo" | "contacto" | null>(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") {
      toast.info("Acceso denegado");
      router.push("/radioLifra");
      return;
    }
    (async () => {
      const [s, e, c] = await Promise.all([getConfigStats(), getConfigEquipo(), getConfigContacto()]);
      setStats(s.length ? s : stats);
      setMiembros(e.miembros?.length ? e.miembros : [emptyMember()]);
      setMetodos(c.length ? c : [emptyContact()]);
      if (e.fotoGrupalUrl) setFotoPreview(e.fotoGrupalUrl);
      setLoaded(true);
    })();
  }, [loading, user]);

  const toggleSection = (s: "stats" | "equipo" | "contacto") => {
    setOpenSection((prev) => (prev === s ? null : s));
  };

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.info("La imagen supera los 3 MB");
      e.target.value = "";
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.info("Solo imágenes JPEG o PNG");
      e.target.value = "";
      return;
    }
    setFotoFile(file);
    if (fotoPreviewRef.current) URL.revokeObjectURL(fotoPreviewRef.current);
    const url = URL.createObjectURL(file);
    fotoPreviewRef.current = url;
    setFotoPreview(url);
  };

  const toastLoading = (msg: string) =>
    toast.custom(
      () => (
        <div className="flex gap-2 items-center bg-white px-5 py-3 rounded-xl shadow-md border">
          <Spinner className="text-Light-Green-Lifra" />
          <span className="text-gray-700 font-medium">{msg}</span>
        </div>
      ),
      { duration: Infinity }
    );

  const handleSaveStats = async () => {
    const invalid = stats.some((s) => !s.number.trim() || !s.label.trim());
    if (invalid) return toast.warning("Complete todos los campos de estadísticas");
    setSaving("stats");
    const id = toastLoading("Guardando estadísticas...");
    const res = await saveConfigStats(stats);
    toast.dismiss(id);
    setSaving("");
    res.ok ? toast.success("Estadísticas guardadas") : toast.error("Error al guardar");
  };

  const handleSaveEquipo = async () => {
    const invalid = miembros.some((m) => !m.role.trim() || !m.name.trim() || !m.degree.trim());
    if (invalid) return toast.warning("Complete todos los campos del equipo");
    setSaving("equipo");
    const id = toastLoading("Guardando equipo...");
    try {
      const res = await saveConfigEquipo(miembros, fotoFile);
      toast.dismiss(id);
      if (res.ok) {
        toast.success("Equipo guardado");
        if (res.fotoUrl) setFotoPreview(res.fotoUrl);
        setFotoFile(null);
      } else {
        console.error("Error guardando equipo:", res.error);
        toast.error(`Error al guardar: ${res.error?.message || "Error de Firebase Storage"}`);
      }
    } catch (err: any) {
      toast.dismiss(id);
      console.error("Error inesperado:", err);
      toast.error(`Error inesperado: ${err?.message || "Unknown error"}`);
    } finally {
      setSaving("");
    }
  };

  const handleSaveContacto = async () => {
    const invalid = metodos.some((m) => !m.icon || !m.title.trim() || !m.content.trim());
    if (invalid) return toast.warning("Complete icono, título y contenido en todos los métodos");
    setSaving("contacto");
    const id = toastLoading("Guardando contacto...");
    const res = await saveConfigContacto(metodos);
    toast.dismiss(id);
    setSaving("");
    res.ok ? toast.success("Contacto guardado") : toast.error("Error al guardar");
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8 text-Dark-Green-Lifra" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">Configuración del Colegio</h1>

      {/* Stats Section */}
      <div className="bg-white shadow rounded-2xl p-6">
        <button
          type="button"
          className="w-full flex items-center justify-between text-left"
          onClick={() => toggleSection("stats")}
        >
          <h2 className="text-xl font-semibold text-gray-800">Estadísticas</h2>
          {openSection === "stats" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSection === "stats" && (
          <div className="mt-4 space-y-3">
            {stats.map((s, i) => (
              <div key={i} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Número</label>
                  <Input value={s.number} maxLength={10} placeholder="250+"
                    onChange={(e) => { const n = [...stats]; n[i].number = e.target.value; setStats(n); }} />
                </div>
                <div className="flex-[2]">
                  <label className="text-xs text-gray-500">Etiqueta</label>
                  <Input value={s.label} maxLength={40} placeholder="Estudiantes"
                    onChange={(e) => { const n = [...stats]; n[i].label = e.target.value; setStats(n); }} />
                </div>
              </div>
            ))}
            <Button
              onClick={handleSaveStats} disabled={saving === "stats"}
              className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra text-white mt-2"
            >
              {saving === "stats" ? <Spinner /> : "Guardar Estadísticas"}
            </Button>
          </div>
        )}
      </div>

      {/* Equipo Section */}
      <div className="bg-white shadow rounded-2xl p-6">
        <button
          type="button"
          className="w-full flex items-center justify-between text-left"
          onClick={() => toggleSection("equipo")}
        >
          <h2 className="text-xl font-semibold text-gray-800">Equipo Directivo</h2>
          {openSection === "equipo" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSection === "equipo" && (
          <div className="mt-4 space-y-4">
            {miembros.map((m, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Miembro {i + 1}</span>
                  {miembros.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => { setMiembros(miembros.filter((_, j) => j !== i)); }}>
                      <Trash2 className="text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Cargo</label>
                    <Input value={m.role} maxLength={60} placeholder="Director"
                      onChange={(e) => { const n = [...miembros]; n[i].role = e.target.value; setMiembros(n); }} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Nombre</label>
                    <Input value={m.name} maxLength={80} placeholder="Nombre completo"
                      onChange={(e) => { const n = [...miembros]; n[i].name = e.target.value; setMiembros(n); }} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Título académico</label>
                    <Input value={m.degree} maxLength={60} placeholder="Dr. / MSc. / Lic."
                      onChange={(e) => { const n = [...miembros]; n[i].degree = e.target.value; setMiembros(n); }} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setMiembros([...miembros, emptyMember()])}>
              <Plus /> Agregar miembro
            </Button>

            <div className="border-t pt-4 mt-2">
              <label className="text-sm font-medium text-gray-700">Foto grupal del equipo</label>
              <Input type="file" accept="image/jpeg,image/png" onChange={handleFoto} className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">JPEG o PNG, máximo 3 MB</p>
              {fotoPreview && (
                <img src={fotoPreview} alt="Vista previa" className="mt-2 max-h-40 rounded border" />
              )}
            </div>

            <Button
              onClick={handleSaveEquipo} disabled={saving === "equipo"}
              className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra text-white"
            >
              {saving === "equipo" ? <Spinner /> : "Guardar Equipo"}
            </Button>
          </div>
        )}
      </div>

      {/* Contacto Section */}
      <div className="bg-white shadow rounded-2xl p-6">
        <button
          type="button"
          className="w-full flex items-center justify-between text-left"
          onClick={() => toggleSection("contacto")}
        >
          <h2 className="text-xl font-semibold text-gray-800">Contacto</h2>
          {openSection === "contacto" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSection === "contacto" && (
          <div className="mt-4 space-y-4">
            {metodos.map((m, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Método {i + 1}</span>
                  {metodos.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => { setMetodos(metodos.filter((_, j) => j !== i)); }}>
                      <Trash2 className="text-red-500" />
                    </Button>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">Ícono</label>
                  <Select
                    value={m.icon}
                    onValueChange={(v) => { const n = [...metodos]; n[i].icon = v; setMetodos(n); }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LUCIDE_ICONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Título</label>
                    <Input value={m.title} maxLength={40} placeholder="Teléfono"
                      onChange={(e) => { const n = [...metodos]; n[i].title = e.target.value; setMetodos(n); }} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Contenido</label>
                    <Input value={m.content} maxLength={120} placeholder="+506 2544-0166"
                      onChange={(e) => { const n = [...metodos]; n[i].content = e.target.value; setMetodos(n); }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Descripción (opcional)</label>
                  <Input value={m.description || ""} maxLength={80} placeholder="Lunes a Viernes"
                    onChange={(e) => { const n = [...metodos]; n[i].description = e.target.value; setMetodos(n); }} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setMetodos([...metodos, emptyContact()])}>
              <Plus /> Agregar método
            </Button>

            <Button
              onClick={handleSaveContacto} disabled={saving === "contacto"}
              className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra text-white mt-2"
            >
              {saving === "contacto" ? <Spinner /> : "Guardar Contacto"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
