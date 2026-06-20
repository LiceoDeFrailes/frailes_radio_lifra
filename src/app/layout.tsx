import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Liceo De Frailes | Educación de Calidad en Desamparados",
  description: "Institución educativa con orientación tecnológica. Formando líderes del mañana con excelencia académica y valores humanos desde 1976.",
  keywords: ["liceo", "frailes", "desamparados", "educación", "tecnología", "costa rica", "MEP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-white">
      <head>
        <meta name="google-site-verification" content="hT1EfEVVK9fe3-0Uaxqo-ntUofJPw1HQh6NDzGL3378" />
        <link
          rel="preconnect"
          href="https://frailesradiolifra.firebaseapp.com"
        />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link
          rel="dns-prefetch"
          href="https://frailesradiolifra.firebaseapp.com"
        />
        <link
          rel="dns-prefetch"
          href="https://firebasestorage.googleapis.com"
        />
      </head>

      <body
        className={`${roboto.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>

        <Toaster richColors />
      </body>
    </html>
  );
}
