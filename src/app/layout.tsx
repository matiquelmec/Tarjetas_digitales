import type { Metadata } from "next";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: "Digital Business Cards - Professional Card Generator",
  description: "Create professional digital business cards with our advanced visual editor. Modern designs, instant sharing, and powerful customization.",
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
