import type { Metadata } from "next";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: "Indi - Plataforma Digital Profesional Intergaláctica",
  description: "Transforma tu identidad profesional en una experiencia digital hipnotizante con Indi, tu embajador intergaláctico. Tarjetas digitales premium, CVs inteligentes y presentaciones inmersivas.",
  keywords: "tarjetas digitales, CVs inteligentes, presentaciones inmersivas, identidad digital, networking profesional, Indi",
  authors: [{ name: "Indi Platform" }],
  creator: "Indi - Embajador Intergaláctico",
  openGraph: {
    title: "Indi - Plataforma Digital Profesional Intergaláctica",
    description: "Transforma tu identidad profesional con diseños de otro mundo",
    images: ["/logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indi - Plataforma Digital Profesional",
    description: "Diseños de otro mundo para profesionales terrestres",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        margin: 0,
        padding: 0
      }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
