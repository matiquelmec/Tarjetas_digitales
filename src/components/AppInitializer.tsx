'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { status } = useSession();
  
  useEffect(() => {
    // Verificar si ya se inicializó en esta sesión
    const hasInitialized = sessionStorage.getItem('appInitialized');
    
    if (hasInitialized === 'true') {
      // Ya se inicializó, mostrar contenido inmediatamente
      setIsInitialized(true);
      setShowContent(true);
      return;
    }

    // Esperar a que NextAuth esté listo
    if (status !== 'loading') {
      // NextAuth está listo, inicializar la app
      setIsInitialized(true);
    }
  }, [status]);

  const handleLoadingComplete = () => {
    // Marcar como inicializado para futuras cargas
    sessionStorage.setItem('appInitialized', 'true');
    setShowContent(true);
  };

  // Si NextAuth aún está cargando o no se ha inicializado, mostrar loading
  if (status === 'loading' || !isInitialized) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0)',
        zIndex: 9999
      }}>
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      </div>
    );
  }

  // Si ya se mostró el loading, mostrar contenido inmediatamente
  if (showContent) {
    return <>{children}</>;
  }

  // Primera vez, mostrar loading completo
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0)',
      zIndex: 9999
    }}>
      <LoadingScreen onLoadingComplete={handleLoadingComplete} />
    </div>
  );
}