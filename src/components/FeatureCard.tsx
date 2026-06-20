"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md"
    >
      <CardContent className="p-8 text-center">
        <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
          <div className="w-16 h-16 rounded-full bg-Dark-Green-Lifra/10 flex items-center justify-center text-Dark-Green-Lifra">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4 group-hover:text-Dark-Green-Lifra transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </MotionCard>
  );
}
