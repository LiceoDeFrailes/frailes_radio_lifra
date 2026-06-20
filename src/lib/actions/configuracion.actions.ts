import { db, storage } from "../../../firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const DEFAULT_STATS: Stat[] = [
  { number: "250+", label: "Estudiantes" },
  { number: "25+", label: "Años de experiencia" },
  { number: "9+", label: "Alumnos de Distintos Sectores" },
  { number: "3+", label: "Talleres Tecnologicos" },
];

const DEFAULT_TEAM: TeamMember[] = [
  { role: "Directora", name: "Dra. Lucrecia Amador Meza", degree: "Doctora en Educación" },
  { role: "Asistente de Dirección", name: "Maureen Fallas Marín", degree: "Licenciada en Administración" },
  { role: "Coordinador Académico", name: "Manuel Mora Quirós", degree: "Magíster en Pedagogía" },
];

const DEFAULT_CONTACT: ContactMethod[] = [
  { icon: "Phone", title: "Teléfono", content: "(+506) 2544-0166", description: "Lunes a Viernes 7:00 AM - 4:15 PM" },
  { icon: "Mail", title: "Email", content: "lic.defrailes@mep.go.cr", description: "Atendemos tus consultas" },
  { icon: "MapPin", title: "Dirección", content: "Liceo de Frailes, Desamparados", description: "San José, #10306" },
  { icon: "Clock", title: "Horario", content: "7:00 AM - 4:15 PM", description: "Lunes a Viernes" },
];

export async function getConfigStats(): Promise<Stat[]> {
  try {
    const snap = await getDoc(doc(db, "configuracion", "stats"));
    if (!snap.exists()) return DEFAULT_STATS;
    return (snap.data() as StatsDoc).items ?? DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export async function getConfigEquipo(): Promise<EquipoDoc> {
  try {
    const snap = await getDoc(doc(db, "configuracion", "equipo"));
    if (!snap.exists()) return { fotoGrupalUrl: "", miembros: DEFAULT_TEAM };
    return snap.data() as EquipoDoc;
  } catch {
    return { fotoGrupalUrl: "", miembros: DEFAULT_TEAM };
  }
}

export async function getConfigContacto(): Promise<ContactMethod[]> {
  try {
    const snap = await getDoc(doc(db, "configuracion", "contacto"));
    if (!snap.exists()) return DEFAULT_CONTACT;
    return (snap.data() as ContactoDoc).metodos ?? DEFAULT_CONTACT;
  } catch {
    return DEFAULT_CONTACT;
  }
}

export async function saveConfigStats(items: Stat[]) {
  try {
    await setDoc(doc(db, "configuracion", "stats"), { items });
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function saveConfigEquipo(
  miembros: TeamMember[],
  file?: File | null
): Promise<{ ok: boolean; error?: any; fotoUrl?: string }> {
  try {
    let fotoGrupalUrl = "";
    if (file) {
      const storageRef = ref(storage, "equipo/foto-grupal.jpg");
      await uploadBytes(storageRef, file);
      fotoGrupalUrl = await getDownloadURL(storageRef);
    } else {
      const snap = await getDoc(doc(db, "configuracion", "equipo"));
      fotoGrupalUrl = snap.exists() ? (snap.data() as EquipoDoc).fotoGrupalUrl ?? "" : "";
    }
    await setDoc(doc(db, "configuracion", "equipo"), { fotoGrupalUrl, miembros });
    return { ok: true, fotoUrl: fotoGrupalUrl };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function saveConfigContacto(metodos: ContactMethod[]) {
  try {
    await setDoc(doc(db, "configuracion", "contacto"), { metodos });
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
