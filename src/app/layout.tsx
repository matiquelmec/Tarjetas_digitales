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
