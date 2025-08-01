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
      styles.push(`
        .business-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `);
    }

    // Glassmorphism
    if (effects.glassmorphism.enabled) {
      const intensity = effects.glassmorphism.intensity || 0.8;
      styles.push(`
        .business-card {
          backdrop-filter: blur(${10 * intensity}px);
          background: rgba(255, 255, 255, ${0.1 * intensity}) !important;
          border: 1px solid rgba(255, 255, 255, ${0.2 * intensity});
        }
      `);
    }

    // Subtle Animations
    if (effects.subtleAnimations.enabled) {
      styles.push(`
        .business-card {
          animation: breathe 4s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
      `);
    }

    // Background Patterns
    if (effects.backgroundPatterns.enabled) {
      styles.push(`
        .business-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
          border-radius: inherit;
          pointer-events: none;
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
      warnings.push("Glassmorphism y patrones de fondo pueden crear conflictos visuales");
      recommendations.push("Considera reducir la intensidad de uno de los efectos");
    }

    // Muchos efectos activos pueden afectar performance
    const activeEffects = Object.values(effects).filter(effect => effect.enabled).length;
    if (activeEffects > 3) {
      warnings.push(`${activeEffects} efectos activos pueden afectar performance`);
      recommendations.push("Considera desactivar algunos efectos para mejor rendimiento");
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