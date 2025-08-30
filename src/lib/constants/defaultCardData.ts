/**
 * Datos de ejemplo unificados para todas las vistas previas
 * Mantiene consistencia entre PC y móvil
 */

export const DEFAULT_CARD_DATA = {
  // Datos básicos - Profesional moderno
  name: 'Carlos Mendoza',
  title: 'Director de Tecnología',
  about: 'Líder en transformación digital con más de 10 años de experiencia en desarrollo de software y gestión de equipos. Especializado en arquitectura cloud y metodologías ágiles.',
  company: 'Tech Innovations Chile',
  email: 'carlos@techinnovations.cl',
  phone: '+56 9 9876 5432',
  location: 'Las Condes, Santiago',
  whatsapp: '56998765432',
  
  // Diseño moderno y limpio - Sin efectos especiales por defecto
  template: 'modern',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  
  // Tema Emerald moderno - Gradiente verde elegante  
  cardBackgroundColor: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
  cardTextColor: '#ffffff',
  pageBackgroundColor: '#0a2e1a', // Fondo verde muy oscuro
  buttonSecondaryColor: '#10b981', // Verde esmeralda brillante
  buttonSecondaryHoverColor: '#059669',
  buttonNormalBackgroundColor: 'rgba(16, 185, 129, 0.2)',
  fontFamily: 'Inter', // Fuente moderna y legible
  
  // Efectos visuales - Desactivados por defecto para mejor rendimiento
  enableHoverEffect: false,
  enableGlassmorphism: false,
  enableSubtleAnimations: false,
  enableBackgroundPatterns: false,
  
  // Sistema de partículas - Desactivado
  enableParticles: false,
  particleType: 'floating' as const,
  particleCount: 30,
  particleDensity: 3,
  
  // Efectos de ambiente - Desactivados para simplicidad
  enableAnimatedGradient: false,
  animatedGradientType: 'aurora',
  animatedGradientSpeed: 3,
  animatedGradientIntensity: 3,
  animatedGradientOpacity: 50,
  enableFloatingShapes: false,
  floatingShapesType: 'geometric',
  floatingShapesCount: 3,
  floatingShapesSpeed: 3,
  ambientIntensity: 3,
  ambientOpacity: 50,
  
  // Redes sociales - Datos profesionales de ejemplo
  linkedin: 'https://linkedin.com/in/carlosmendoza',
  twitter: '',
  instagram: '',
  website: 'https://carlosmendoza.tech',
  facebook: '',
  appointmentLink: 'https://calendly.com/carlosmendoza',
  
  // Detalles profesionales
  professionalDetails: `• MBA en Innovación Tecnológica - Universidad de Chile
• Certificación AWS Solutions Architect
• Speaker en conferencias de tecnología
• Mentor en programas de emprendimiento

Especialidades:
- Cloud Architecture (AWS, Azure)
- Transformación Digital
- Liderazgo de Equipos
- Metodologías Ágiles`,
  
  // Configuración
  customUrl: '',
  isPublic: true,
};

/**
 * Tema moderno recomendado - Colores profesionales y accesibles
 */
export const MODERN_THEME = {
  name: 'Modern Professional',
  description: 'Diseño limpio y moderno con gradiente sutil',
  colors: {
    cardBackgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardTextColor: '#ffffff',
    pageBackgroundColor: '#1a1a2e',
    buttonSecondaryColor: '#fbbf24',
    buttonSecondaryHoverColor: '#f59e0b',
    buttonNormalBackgroundColor: 'rgba(251, 191, 36, 0.15)'
  },
  fontFamily: 'Inter',
  // Sin efectos especiales para mejor rendimiento
  effects: {
    enableHoverEffect: false,
    enableGlassmorphism: false,
    enableSubtleAnimations: false,
    enableBackgroundPatterns: false,
    enableParticles: false,
    enableAnimatedGradient: false,
    enableFloatingShapes: false
  }
};

/**
 * Configuración para vista previa sin efectos
 */
export const PREVIEW_CONFIG = {
  // Desactivar todos los efectos especiales en preview
  disableAllEffects: true,
  // Usar datos consistentes
  useDefaultData: true,
  // Altura fija para preview
  previewHeight: '600px',
  // Fondo consistente
  consistentBackground: true
};