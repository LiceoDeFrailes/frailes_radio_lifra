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
  title: "Liceo De Frailes",
  description: "Liceo de Frailes de Desamparados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
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
