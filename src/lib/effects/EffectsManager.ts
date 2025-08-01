/**
 * Sistema Modular de Efectos Visuales
 * Arquitectura limpia para gestionar todos los efectos de las tarjetas digitales
 */

export interface EffectConfig {
  enabled: boolean;
  intensity?: number;
  customProperties?: Record<string, any>;
}

export interface ParticleConfig extends EffectConfig {
  type: 'floating' | 'constellation' | 'professional' | 'creative';
  count: number;
  color?: string;
  speed?: number;
}

export interface VisualEffectsState {
  hoverEffect: EffectConfig;
  glassmorphism: EffectConfig;
  subtleAnimations: EffectConfig;
  backgroundPatterns: EffectConfig;
  particles: ParticleConfig;
}

export class EffectsManager {
  private static instance: EffectsManager;
  
  public static getInstance(): EffectsManager {
    if (!EffectsManager.instance) {
      EffectsManager.instance = new EffectsManager();
    }
    return EffectsManager.instance;
  }

  /**
   * Convierte las props legacy al nuevo formato modular
   */
  public convertLegacyProps(props: {
    enableHoverEffect?: boolean;
    enableGlassmorphism?: boolean;
    enableSubtleAnimations?: boolean;
    enableBackgroundPatterns?: boolean;
    enableParticles?: boolean;
    particleType?: string;
    particleCount?: number;
  }): VisualEffectsState {
    return {
      hoverEffect: {
        enabled: props.enableHoverEffect || false,
        intensity: 1
      },
      glassmorphism: {
        enabled: props.enableGlassmorphism || false,
        intensity: 0.8
      },
      subtleAnimations: {
        enabled: props.enableSubtleAnimations || false,
        intensity: 0.6
      },
      backgroundPatterns: {
        enabled: props.enableBackgroundPatterns || false,
        intensity: 0.4
      },
      particles: {
        enabled: props.enableParticles || false,
        type: (props.particleType as any) || 'floating',
        count: props.particleCount || 30,
        intensity: 1,
        speed: 1
      }
    };
  }

  /**
   * Genera CSS dinámico para efectos activos
   */
  public generateEffectStyles(effects: VisualEffectsState, cardColors: {
    background: string;
    text: string;
  }): string {
    const styles: string[] = [];

    // Hover Effects
    if (effects.hoverEffect.enabled) {
      const intensity = effects.hoverEffect.intensity || 1;
      const liftAmount = 5 * intensity;
      const scaleAmount = 1 + (0.02 * intensity);
      const shadowIntensity = 0.3 * intensity;
      
      styles.push(`
        .business-card-custom.effect-hover {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .business-card-custom.effect-hover:hover {
          transform: translateY(-${liftAmount}px) scale(${scaleAmount});
          box-shadow: 0 ${liftAmount * 4}px ${liftAmount * 8}px rgba(0, 0, 0, ${shadowIntensity});
        }
      `);
    }

    // Glassmorphism
    if (effects.glassmorphism.enabled) {
      const intensity = effects.glassmorphism.intensity || 0.8;
      
      // Extraer el color base del fondo del usuario
      const baseColor = this.extractBaseColor(cardColors.background);
      const isLightBackground = this.isLightColor(baseColor);
      
      // Aplicar glassmorphism manteniendo el color base del usuario
      // En lugar de overlay sólido, usar un efecto más sutil
      const blurAmount = 6 * intensity;
      const borderOpacity = 0.25 * intensity;
      const shadowStrength = 0.2 * intensity;

      styles.push(`
        .business-card-custom.effect-glass {
          backdrop-filter: blur(${blurAmount}px) saturate(1.1);
          -webkit-backdrop-filter: blur(${blurAmount}px) saturate(1.1);
          border: 1px solid rgba(255, 255, 255, ${borderOpacity});
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, ${shadowStrength}),
            inset 0 1px 0 rgba(255, 255, 255, ${borderOpacity * 2});
          position: relative;
        }
        
        /* Efecto de brillo sutil en la parte superior */
        .business-card-custom.effect-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, ${isLightBackground ? 0.1 * intensity : 0.05 * intensity}) 0%,
            transparent 100%
          );
          border-radius: inherit;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        /* Asegurar que el contenido esté por encima */
        .business-card-custom.effect-glass .card-body,
        .business-card-custom.effect-glass .card-body > *,
        .business-card-custom.effect-glass > * {
          position: relative;
          z-index: 2;
        }
      `);
    }

    // Subtle Animations
    if (effects.subtleAnimations.enabled) {
      const intensity = effects.subtleAnimations.intensity || 0.6;
      const scaleAmount = 1 + (0.01 * intensity);
      const duration = 4 + (2 * (1 - intensity)); // Más lento = más sutil
      
      styles.push(`
        .business-card-custom.effect-animate {
          animation: subtleBreathe ${duration}s ease-in-out infinite;
        }
        
        /* Solo aplicar breathe si NO hay hover activo */
        .business-card-custom.effect-animate:not(.effect-hover) {
          animation: subtleBreathe ${duration}s ease-in-out infinite;
        }
        
        /* Si hay hover, pausar la animación durante hover */
        .business-card-custom.effect-animate.effect-hover:hover {
          animation-play-state: paused;
        }
        
        @keyframes subtleBreathe {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1);
          }
          50% { 
            transform: scale(${scaleAmount});
            filter: brightness(1.02);
          }
        }
      `);
    }

    // Background Patterns
    if (effects.backgroundPatterns.enabled) {
      const intensity = effects.backgroundPatterns.intensity || 0.4;
      const patternOpacity = 0.2 * intensity;
      
      // Usar ::after para evitar conflicto con glassmorphism que usa ::before
      const pseudoElement = effects.glassmorphism.enabled ? '::after' : '::before';
      const zIndex = effects.glassmorphism.enabled ? 1 : 0;
      
      // Adaptar colores según el fondo del usuario
      const baseColor = this.extractBaseColor(cardColors.background);
      const isLight = this.isLightColor(baseColor);
      
      const pattern1Color = isLight 
        ? `rgba(100, 100, 200, ${patternOpacity})` 
        : `rgba(200, 200, 255, ${patternOpacity})`;
      const pattern2Color = isLight 
        ? `rgba(200, 100, 200, ${patternOpacity})` 
        : `rgba(255, 200, 255, ${patternOpacity})`;
      
      styles.push(`
        .business-card-custom.effect-patterns {
          position: relative;
        }
        .business-card-custom.effect-patterns${pseudoElement} {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 75%, ${pattern1Color} 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, ${pattern2Color} 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, ${patternOpacity * 0.5}) 0%, transparent 30%);
          border-radius: inherit;
          pointer-events: none;
          z-index: ${zIndex};
          opacity: 0;
          animation: patternFadeIn 2s ease-in-out forwards;
        }
        
        @keyframes patternFadeIn {
          to { opacity: 1; }
        }
      `);
    }

    return styles.join('\n');
  }

  /**
   * Genera configuración de partículas basada en tipo
   */
  public generateParticleConfig(particles: ParticleConfig): any {
    if (!particles.enabled) return null;

    const baseConfig = {
      particles: {
        number: {
          value: particles.count,
          density: { enable: true, value_area: 800 }
        },
        color: { value: particles.color || "#ffffff" },
        opacity: {
          value: 0.6,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1 }
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.5 }
        },
        move: {
          enable: true,
          speed: particles.speed || 1,
          direction: "none" as const,
          random: true,
          straight: false,
          out_mode: "out" as const,
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas" as const,
        events: {
          onhover: { enable: true, mode: "repulse" as const },
          onclick: { enable: true, mode: "push" as const }
        }
      }
    };

    // Configuraciones específicas por tipo
    switch (particles.type) {
      case 'constellation':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            line_linked: {
              enable: true,
              distance: 150,
              color: particles.color || "#ffffff",
              opacity: 0.4,
              width: 1
            }
          }
        };

      case 'professional':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            shape: { type: "circle" as const },
            size: { value: 2, random: false },
            move: {
              ...baseConfig.particles.move,
              speed: 0.5,
              direction: "top" as const
            }
          }
        };

      case 'creative':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            shape: { 
              type: "polygon" as const,
              polygon: { nb_sides: 6 }
            },
            size: { value: 4, random: true },
            move: {
              ...baseConfig.particles.move,
              speed: 2,
              direction: "none" as const
            }
          }
        };

      default: // floating
        return baseConfig;
    }
  }

  /**
   * Extrae el color base de un fondo (puede ser color sólido o gradiente)
   */
  private extractBaseColor(background: string): string {
    if (background.includes('linear-gradient')) {
      // Extraer el primer color del gradiente
      const colorMatch = background.match(/#[0-9a-fA-F]{6}/);
      return colorMatch ? colorMatch[0] : '#000000';
    }
    return background;
  }

  /**
   * Determina si un color es claro u oscuro
   */
  private isLightColor(color: string): boolean {
    if (!color.startsWith('#')) return false;
    
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Fórmula de luminancia
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  /**
   * Valida compatibilidad de efectos
   */
  public validateEffectCombination(effects: VisualEffectsState): {
    isValid: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Glassmorphism + Background Patterns puede causar conflictos visuales
    if (effects.glassmorphism.enabled && effects.backgroundPatterns.enabled) {
      warnings.push("Glassmorphism y patrones de fondo activos - usando ::after para patrones");
      recommendations.push("Efectos compatibles - sin problemas detectados");
    }

    // Hover + Subtle Animations pueden colisionar
    if (effects.hoverEffect.enabled && effects.subtleAnimations.enabled) {
      recommendations.push("Hover pausará animaciones automáticamente durante interacción");
    }

    // Partículas + muchos efectos
    if (effects.particles.enabled) {
      const otherEffects = Object.entries(effects)
        .filter(([key, effect]) => key !== 'particles' && effect.enabled).length;
      
      if (otherEffects > 2) {
        warnings.push(`Partículas + ${otherEffects} efectos adicionales pueden afectar performance`);
        recommendations.push("En móviles se reducirá automáticamente el número de partículas");
      }

      // Validar tipo de partícula
      const validTypes = ['floating', 'constellation', 'professional', 'creative'];
      if (!validTypes.includes(effects.particles.type)) {
        warnings.push(`Tipo de partícula "${effects.particles.type}" no reconocido`);
        recommendations.push("Usar: floating, constellation, professional, o creative");
      }
    }

    // Muchos efectos activos pueden afectar performance
    const activeEffects = Object.values(effects).filter(effect => effect.enabled).length;
    if (activeEffects > 4) {
      warnings.push(`${activeEffects} efectos activos - performance puede verse afectada`);
      recommendations.push("Considera reducir efectos o usar configuración automática para móvil");
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      recommendations
    };
  }

  /**
   * Optimiza efectos según el dispositivo
   */
  public optimizeForDevice(effects: VisualEffectsState, isMobile: boolean): VisualEffectsState {
    if (!isMobile) return effects;

    // En móvil, reducir intensidad de efectos
    return {
      ...effects,
      hoverEffect: { ...effects.hoverEffect, enabled: false }, // Sin hover en móvil
      glassmorphism: { 
        ...effects.glassmorphism, 
        intensity: (effects.glassmorphism.intensity || 1) * 0.7 
      },
      particles: {
        ...effects.particles,
        count: Math.min(effects.particles.count, 15), // Menos partículas
        speed: (effects.particles.speed || 1) * 0.5
      }
    };
  }
}

export default EffectsManager;