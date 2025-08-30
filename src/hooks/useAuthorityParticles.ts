/**
 * Authority Presence Particles System v2.0
 * Transmite liderazgo y competencia profesional mediante partículas inteligentes
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface AuthorityParticle {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  angle: number;
  radius: number;
  speed: number;
  opacity: number;
  scale: number;
  phase: number;
  color: string;
  glowIntensity: number;
}

interface AuthorityParticlesConfig {
  enabled: boolean;
  count: number; // 3-5 máximo para elegancia
  theme: string;
  containerWidth: number;
  containerHeight: number;
  intensity: 'minimal' | 'balanced' | 'prominent';
  interactionMode: 'hover' | 'always' | 'strategic';
}

interface DeviceOptimization {
  isMobile: boolean;
  isLowPower: boolean;
  preferReducedMotion: boolean;
}

export function useAuthorityParticles(config: AuthorityParticlesConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<AuthorityParticle[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  
  const [deviceOptimization, setDeviceOptimization] = useState<DeviceOptimization>({
    isMobile: false,
    isLowPower: false,
    preferReducedMotion: false
  });

  // Detectar capacidades del dispositivo
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = window.innerWidth < 768;
      const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Estimar si es low power (heurística)
      const isLowPower = isMobile && (
        navigator.hardwareConcurrency <= 2 ||
        (navigator as any).connection?.effectiveType?.includes('slow') ||
        (navigator as any).getBattery?.()?.level < 0.2
      );

      setDeviceOptimization({
        isMobile,
        isLowPower,
        preferReducedMotion
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    // Escuchar cambios en batería si está disponible
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setDeviceOptimization(prev => ({
            ...prev,
            isLowPower: prev.isMobile && battery.level < 0.2
          }));
        };
        
        battery.addEventListener('levelchange', updateBattery);
        return () => battery.removeEventListener('levelchange', updateBattery);
      });
    }

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Generar colores de autoridad basados en tema
  const getAuthorityColor = useCallback((theme: string, alpha: number = 0.8): string => {
    const authorityColors = {
      diamond: `rgba(121, 134, 203, ${alpha})`,      // Azul diamante elegante
      emerald: `rgba(16, 185, 129, ${alpha})`,       // Verde esmeralda poder
      platinum: `rgba(224, 224, 224, ${alpha})`,     // Platino sofisticado
      sapphire: `rgba(179, 229, 252, ${alpha})`,     // Azul zafiro confianza
      ruby: `rgba(248, 187, 217, ${alpha})`,         // Rosa rubí creatividad
      gold: `rgba(255, 204, 2, ${alpha})`,           // Oro financiero
      executive: `rgba(255, 215, 0, ${alpha})`,      // Dorado ejecutivo
      professional: `rgba(0, 102, 204, ${alpha})`,   // Azul profesional
      creative: `rgba(142, 45, 226, ${alpha})`       // Púrpura creativo
    };
    
    return authorityColors[theme as keyof typeof authorityColors] || authorityColors.professional;
  }, []);

  // Crear partículas de autoridad optimizadas
  const createAuthorityParticles = useCallback(() => {
    if (!config.enabled || deviceOptimization.preferReducedMotion) {
      return [];
    }

    // Optimización por dispositivo
    let particleCount = config.count;
    if (deviceOptimization.isMobile) {
      particleCount = Math.min(particleCount, 3); // Máximo 3 en móvil
    }
    if (deviceOptimization.isLowPower) {
      particleCount = Math.min(particleCount, 2); // Máximo 2 en low power
    }

    const particles: AuthorityParticle[] = [];
    const centerX = config.containerWidth / 2;
    const centerY = config.containerHeight / 2;

    for (let i = 0; i < particleCount; i++) {
      // Distribución en órbitas elegantes
      const orbitRadius = 40 + (i * 15); // Órbitas concéntricas
      const initialAngle = (i / particleCount) * 2 * Math.PI;
      
      const particle: AuthorityParticle = {
        id: `authority-${i}`,
        x: centerX + Math.cos(initialAngle) * orbitRadius,
        y: centerY + Math.sin(initialAngle) * orbitRadius,
        targetX: centerX,
        targetY: centerY,
        angle: initialAngle,
        radius: orbitRadius,
        speed: 0.008 + (i * 0.002), // Velocidades escalonadas elegantes
        opacity: 0.6 + (i * 0.1), // Opacidad variable
        scale: 1,
        phase: i * (Math.PI / particleCount), // Desfase para movimiento orgánico
        color: getAuthorityColor(config.theme, 0.8),
        glowIntensity: 0.4
      };

      particles.push(particle);
    }

    return particles;
  }, [config, deviceOptimization, getAuthorityColor]);

  // Actualizar partículas con movimiento de autoridad
  const updateAuthorityParticles = useCallback((deltaTime: number) => {
    particlesRef.current = particlesRef.current.map(particle => {
      // Movimiento orbital elegante
      particle.angle += particle.speed * deltaTime;
      
      // Posición orbital con variación orgánica
      const baseX = particle.targetX + Math.cos(particle.angle) * particle.radius;
      const baseY = particle.targetY + Math.sin(particle.angle) * particle.radius;
      
      // Añadir movimiento sutil para autoridad orgánica
      const organicOffset = Math.sin(particle.angle + particle.phase) * 3;
      
      particle.x = baseX + organicOffset;
      particle.y = baseY + organicOffset * 0.5;
      
      // Respiración de autoridad (escala sutil)
      particle.scale = 1 + Math.sin(particle.angle * 2 + particle.phase) * 0.1;
      
      // Glow pulsante de confianza
      particle.glowIntensity = 0.4 + Math.sin(particle.angle * 3) * 0.2;
      
      // Opacidad que transmite presencia constante
      particle.opacity = 0.6 + Math.sin(particle.angle + particle.phase) * 0.2;

      return particle;
    });
  }, []);

  // Renderizar partículas con efectos de autoridad
  const renderAuthorityParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(particle => {
      ctx.save();
      
      // Configurar blending para elegancia
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = particle.opacity;
      
      // Centro de la partícula
      ctx.translate(particle.x, particle.y);
      ctx.scale(particle.scale, particle.scale);
      
      // Glow exterior de autoridad
      const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);
      glowGradient.addColorStop(0, particle.color);
      glowGradient.addColorStop(0.5, particle.color.replace(/[\d.]+\)$/, `${particle.glowIntensity * 0.6})`));
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Núcleo sólido de presencia
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
      coreGradient.addColorStop(0, particle.color);
      coreGradient.addColorStop(1, particle.color.replace(/[\d.]+\)$/, '0.9)'));
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }, []);

  // Loop de animación optimizado
  const animate = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;

    const deltaTime = Math.min(currentTime - lastFrameTimeRef.current, 16.67); // Cap at 60fps
    lastFrameTimeRef.current = currentTime;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, config.containerWidth, config.containerHeight);

    // Solo actualizar si hay partículas
    if (particlesRef.current.length > 0) {
      updateAuthorityParticles(deltaTime);
      renderAuthorityParticles(ctx);
    }

    // Continuar animación solo si está habilitada
    if (config.enabled && !deviceOptimization.preferReducedMotion) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [config, deviceOptimization, updateAuthorityParticles, renderAuthorityParticles]);

  // Inicializar sistema de partículas
  useEffect(() => {
    if (!canvasRef.current || !config.enabled) return;

    // Configurar canvas
    const canvas = canvasRef.current;
    canvas.width = config.containerWidth;
    canvas.height = config.containerHeight;

    // Crear partículas iniciales
    particlesRef.current = createAuthorityParticles();

    // Iniciar animación
    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, createAuthorityParticles, animate]);

  // Función para activar modo estratégico (ej: hover)
  const activateStrategicMode = useCallback(() => {
    particlesRef.current = particlesRef.current.map(particle => ({
      ...particle,
      speed: particle.speed * 1.5, // Acelerar movimiento
      glowIntensity: particle.glowIntensity * 1.3 // Intensificar presencia
    }));
  }, []);

  // Función para desactivar modo estratégico
  const deactivateStrategicMode = useCallback(() => {
    particlesRef.current = createAuthorityParticles(); // Reset a estado normal
  }, [createAuthorityParticles]);

  // Debug info (solo en desarrollo)
  const debugInfo = process.env.NODE_ENV === 'development' ? {
    particleCount: particlesRef.current.length,
    deviceOptimization,
    performance: {
      mobile: deviceOptimization.isMobile,
      lowPower: deviceOptimization.isLowPower,
      reducedMotion: deviceOptimization.preferReducedMotion
    }
  } : undefined;

  return {
    canvasRef,
    activateStrategicMode,
    deactivateStrategicMode,
    isActive: config.enabled && !deviceOptimization.preferReducedMotion,
    debugInfo
  };
}