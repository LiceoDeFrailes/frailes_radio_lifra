"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout/LayoutLiceo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Image from "next/image";
import { getConfigEquipo } from "@/lib/actions/configuracion.actions";

const MotionCard = motion(Card);
const MotionCardContent = motion(CardContent);

export default function SobreNosotros() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [fotoGrupalUrl, setFotoGrupalUrl] = useState("");
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    getConfigEquipo().then((data) => {
      setTeam(data.miembros ?? []);
      setFotoGrupalUrl(data.fotoGrupalUrl ?? "");
      setTeamLoading(false);
    });
  }, []);

  const values = [
    {
      title: "Misión",
      description:
        "Promover el desarrollo integral, mediante una oferta educativa académica y tecnológica; que permita a la persona estudiante la adquisición de destrezas, habilidades, valores y principios de tal manera que pueda continuar con sus estudios superiores y enfrentarse a las demandas de la sociedad actual.",
    },
    {
      title: "Visión",
      description:
        "Ser una institución que promueva el desarrollo integral, fomentando en la Comunidad Educativa un protagonismo activo entre sus estudiantes.",
    },
    {
      title: "Valores",
      description:
        "Familiaridad, Compromiso, Respeto, Responsabilidad, Igualdad, Solidaridad.",
    },
  ];

  return (
    <Layout>
      <section className="py-20 bg-gradient-to-br from-Dark-Green-Lifra to-primary/95 text-primary-foreground">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <Badge variant="secondary" className="mb-4">
            Sobre Nosotros
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nuestra Historia
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Más de 30 años formando líderes con excelencia académica y valores
            humanos
          </p>
        </motion.div>
      </section>

      <section className="py-20 bg-muted/40">
        <motion.div
          className="container mx-auto px-4 max-w-4xl"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center">
            Historia del Liceo de Frailes
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            El Liceo de Frailes con Orientación Tecnológica fue fundado en 1976
            gracias a la donación del terreno por la Asociación de Desarrollo
            Integral de Frailes. Tras funcionar brevemente, cerró por baja
            matrícula y reabrió en 1995 como Unidad Pedagógica Cecilio Piedra,
            recuperando su categoría de Liceo en 1997. En 2007 inició su
            transformación hacia la modalidad tecnológica que mantiene hoy.
            Entre 2019 y 2021 se construyó un nuevo edificio con modernas aulas,
            biblioteca, laboratorio de informática y áreas administrativas.
            Atiende estudiantes de múltiples comunidades, entre ellas El
            Rosario, La Fila, San Juan, Santa Elena, San Cristóbal Sur, La
            Violeta, Bustamante y Frailes.
          </p>
        </motion.div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item, index) => (
              <MotionCard
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center border-0 shadow-lg"
              >
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <motion.div
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Nuestro Equipo Directivo
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Profesionales comprometidos con la excelencia educativa
            </p>
          </div>

          {teamLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <MotionCard
                    key={`${member.role}-${member.name}`}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center border-0 shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <Badge variant="outline" className="mb-2">
                        {member.role}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                      {member.degree && (
                        <p className="text-sm text-muted-foreground">{member.degree}</p>
                      )}
                    </CardContent>
                  </MotionCard>
                ))}
              </div>

              <Image
                src={fotoGrupalUrl || "/images/equipo-grupal.jpg"}
                alt="Foto grupal del equipo directivo del Liceo de Frailes"
                width={800}
                height={450}
                className="rounded-lg shadow-md mx-auto mt-12"
                priority
              />
            </>
          )}
        </motion.div>
      </section>
    </Layout>
  );
}
