import type { Metadata } from "next";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: "Plataforma Digital Profesional - Tarjetas, CVs y Presentaciones",
  description: "Transforma tu identidad profesional en una experiencia digital hipnotizante. Tarjetas digitales premium, CVs inteligentes y presentaciones inmersivas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Poppins:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@300;400;600;700&family=Crimson+Text:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
