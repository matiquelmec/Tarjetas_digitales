import type { Metadata } from "next";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

export const metadata: Metadata = {
  title: "Tarjeta de Presentación Digital - Andrés Astorga Márquez",
  description: "Plataforma de Creación de Tarjetas de Presentación Digitales",
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        {children}
      </body>
    </html>
  );
}
