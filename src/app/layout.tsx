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
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" 
          rel="stylesheet"
        />
        {/* Critical CSS inline para evitar FOUC */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0);
              min-height: 100vh;
            }
            .page-loading {
              background: linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0);
              background-size: 400% 400%;
              animation: gradientAnimation 3s ease infinite;
            }
            @keyframes gradientAnimation {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `
        }} />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
