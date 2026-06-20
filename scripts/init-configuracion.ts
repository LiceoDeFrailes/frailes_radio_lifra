import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.local") });

// Require after env vars are loaded (CJS compatible)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { adminDb } = require("../firebase/admin");

const COLLECTION = "configuracion";

const initialData = {
  stats: {
    items: [
      { number: "250+", label: "Estudiantes" },
      { number: "25+", label: "Años de experiencia" },
      { number: "9+", label: "Alumnos de Distintos Sectores" },
      { number: "3+", label: "Talleres Tecnológicos" },
    ],
  },
  equipo: {
    fotoGrupalUrl: "",
    miembros: [
      {
        role: "Directora",
        name: "Dra. Lucrecia Amador Meza",
        degree: "Doctora en Educación",
      },
      {
        role: "Asistente de Dirección",
        name: "Maureen Fallas Marín",
        degree: "Licenciada en Administración",
      },
      {
        role: "Coordinador Académico",
        name: "Manuel Mora Quirós",
        degree: "Magíster en Pedagogía",
      },
    ],
  },
  contacto: {
    metodos: [
      {
        icon: "Phone",
        title: "Teléfono",
        content: "(+506) 2544-0166",
        description: "Llamadas de lunes a viernes",
      },
      {
        icon: "Mail",
        title: "Email",
        content: "lic.defrailes@mep.go.cr",
        description: "Responderemos en 24-48 horas",
      },
      {
        icon: "MapPin",
        title: "Dirección",
        content: "Liceo de Frailes, Desamparados",
        description: "Costa Rica",
      },
      {
        icon: "Clock",
        title: "Horario",
        content: "7:00 AM - 4:15 PM",
        description: "Lunes a viernes",
      },
    ],
  },
};

async function seed() {
  console.log("🌱 Inicializando colección 'configuracion'...\n");

  for (const [docId, data] of Object.entries(initialData)) {
    try {
      const ref = adminDb.collection(COLLECTION).doc(docId);
      await ref.set(data, { merge: true });
      console.log(`✅ Documento '${docId}' creado/actualizado`);
    } catch (err) {
      console.error(`❌ Error en documento '${docId}':`, err);
      process.exit(1);
    }
  }

  console.log("\n🎉 Configuración inicial completada");
  console.log(
    "   • stats: 4 items de estadísticas del home"
  );
  console.log(
    "   • equipo: 3 miembros + fotoGrupalUrl vacío (usará /images/equipo-grupal.jpg por defecto)"
  );
  console.log("   • contacto: 4 métodos de contacto");
  process.exit(0);
}

seed();
