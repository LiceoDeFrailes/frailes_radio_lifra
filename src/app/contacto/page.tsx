"use client";

import Layout from "@/components/Layout/LayoutLiceo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const MotionCard = motion(Card);
const MotionDiv = motion.div;

export default function Contacto() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const contactInfo = [
    {
      icon: "📞",
      title: "Teléfono",
      content: "(+506) 2544-0166",
      description: "Lunes a Viernes 7:00 AM - 4:15 PM",
    },
    {
      icon: "✉️",
      title: "Email",
      content: "lic.defrailes@mep.go.cr",
      description: "Atendemos tus consultas",
    },
    {
      icon: "📍",
      title: "Dirección",
      content: "Liceo de Frailes, Desamparados",
      description: "San José, #10306",
    },
    {
      icon: "🕒",
      title: "Horario",
      content: "7:00 AM - 4:15 PM",
      description: "Lunes a Viernes",
    },
  ];

  return (
    <Layout>
      <section className="py-20 bg-gradient-to-br from-Dark-Green-Lifra to-primary/95 text-primary-foreground">
        <MotionDiv
          className="container mx-auto px-4 text-center"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <Badge variant="secondary" className="mb-4">
            Contáctanos
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Estamos para Ayudarte
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Resolvemos todas tus dudas sobre admisiones, programas académicos y
            más.
          </p>
        </MotionDiv>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <MotionDiv
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold mb-4">Información de Contacto</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ponte en contacto con nosotros a través de los siguientes medios
            </p>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <MotionCard
                key={info.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{info.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{info.title}</h3>
                  <p className="text-primary font-medium mb-2 text-lg">
                    {info.content}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {info.description}
                  </p>
                </CardContent>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <MotionDiv
            className="text-center mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold mb-4">Visítanos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Te esperamos en nuestras instalaciones para mostrarte todo lo que
              tenemos para ofrecer
            </p>
          </MotionDiv>

          <MotionDiv
            className="bg-muted rounded-lg overflow-hidden shadow-lg"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.166590472664!2d-84.05935712426326!3d9.751952677252266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa11b9ef81951c1%3A0x7b726c5c763de31d!2sLiceo%20de%20Frailes!5e0!3m2!1ses-419!2scr!4v1759167826947!5m2!1ses-419!2scr"
              className="w-full h-96 border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </MotionDiv>

          <MotionDiv
            className="text-center mt-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-muted-foreground">
              📍 <strong>Dirección exacta:</strong> Liceo de Frailes, Desamparados,
              San José, 10306
            </p>
          </MotionDiv>
        </div>
      </section>
    </Layout>
  );
}
