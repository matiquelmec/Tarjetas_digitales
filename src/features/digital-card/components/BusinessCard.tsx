'use client';

import { Card, Stack, Button } from 'react-bootstrap';
import { useEffect, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getBestTextColor, getContrastRatio, isAccessible } from '@/lib/contrast';

const QrCodeDisplay = dynamic(() => import('./QrCodeDisplay'), { ssr: false });

interface BusinessCardProps {
  name: string;
  title: string;
  about: string;
  location: string;
  whatsapp: string;
  email: string;
  photoUrl: string;
  cardBackgroundColor: string;
  cardTextColor: string;
  enableHoverEffect: boolean;
  enableGlassmorphism: boolean;
  enableSubtleAnimations: boolean;
  enableBackgroundPatterns: boolean;
  whatsappShareUrl: string;
  appointmentLink: string;
  professionalDetails: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  buttonSecondaryColor: string;
  buttonNormalBackgroundColor: string;
  buttonSecondaryHoverColor: string;
  template?: string; // Nueva prop para la plantilla visual
}

const staticStyles = `
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-5px) scale(1.02); }
  }
  @keyframes glassShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  /* Animación combinada para patterns - solo aplica si no hay background inline */
  .animated-gradient-background:not([style*="background"]) {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
    position: relative;
  }
  
  /* Para elementos con background inline, solo animar el gradiente existente */
  .animated-gradient-background[style*="linear-gradient"] {
    background-size: 400% 400% !important;
    animation: gradientAnimation 15s ease infinite;
    position: relative;
  }
  
  /* Efecto shimmer para glassmorphism */
  .glass-shimmer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 200% 100%;
    animation: glassShimmer 3s ease-in-out infinite;
    pointer-events: none;
    border-radius: inherit;
  }
  
  /* Hover mejorado que respeta otros efectos */
  .enhanced-hover {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
  }
  
  .enhanced-hover:hover {
    animation: gentleFloat 2s ease-in-out infinite;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15) !important;
  }
  
  /* Corrección para animaciones combinadas */
  .fade-in-active {
    animation: fadeIn 1s ease-out forwards;
  }
  
  /* Para patterns, fadeIn se aplica via style, gradient via class */
  .fade-in-with-patterns {
    /* Solo el fadeIn inicial, gradientAnimation viene de animated-gradient-background */
    animation: fadeIn 1.2s ease-out forwards;
  }
  
  /* Cuando se combinan patterns + animations, el gradiente continúa después del fadeIn */
  .animated-gradient-background.fade-in-with-patterns {
    animation: fadeIn 1.2s ease-out forwards, gradientAnimation 15s ease infinite 1.2s;
  }
  .btn-outline-secondary-custom {
    color: var(--button-secondary-color) !important;
    border-color: var(--button-secondary-color) !important;
    background-color: var(--button-normal-bg-color) !important;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  .btn-outline-secondary-custom:hover {
    color: var(--button-hover-text-color) !important;
    background-color: var(--button-secondary-hover-color) !important;
    border-color: var(--button-secondary-hover-color) !important;
    transform: translateY(-2px);
  }
  
  /* Responsive Design */
  @media (max-width: 576px) {
    .business-card-custom {
      max-width: 100% !important;
      padding: 30px 20px !important;
      margin: 10px !important;
    }
    .business-card-custom h1 {
      font-size: 1.8em !important;
    }
    .business-card-custom h2 {
      font-size: 1.1em !important;
    }
    .business-card-custom p {
      font-size: 0.9em !important;
    }
    .business-card-custom img {
      width: 100px !important;
      height: 100px !important;
    }
  }
`;

export default function BusinessCard({ name, title, about, location, whatsapp, email, photoUrl, cardBackgroundColor, cardTextColor, enableHoverEffect, enableGlassmorphism, enableSubtleAnimations, enableBackgroundPatterns, whatsappShareUrl, appointmentLink, professionalDetails, linkedin, instagram, twitter, facebook, buttonSecondaryColor, buttonNormalBackgroundColor, buttonSecondaryHoverColor, template = 'modern' }: BusinessCardProps) {
  const [qrCodeValue, setQrCodeValue] = useState('');

  // DEBUG: Log para verificar los valores recibidos
  console.log('🎯 BusinessCard received props:', {
    cardBackgroundColor,
    cardTextColor,
    buttonSecondaryColor,
    buttonNormalBackgroundColor,
    buttonSecondaryHoverColor
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrCodeValue(window.location.href);
    }
  }, []);

  // Validar contraste al cargar la tarjeta
  useEffect(() => {
    if (cardBackgroundColor && cardTextColor) {
      validateContrast(cardTextColor, cardBackgroundColor);
    }
    if (buttonSecondaryColor && buttonNormalBackgroundColor) {
      validateContrast(buttonSecondaryColor, buttonNormalBackgroundColor);
    }
  }, [cardBackgroundColor, cardTextColor, buttonSecondaryColor, buttonNormalBackgroundColor]);

  // Usar la utilidad de contraste mejorada
  const getContrastTextColor = (hexcolor: string) => getBestTextColor(hexcolor);
  
  // Función para validar accesibilidad
  const validateContrast = (textColor: string, bgColor: string) => {
    const ratio = getContrastRatio(textColor, bgColor);
    const accessible = isAccessible(textColor, bgColor, 'AA', 'normal');
    
    if (!accessible) {
      console.warn(`Contraste insuficiente: ${ratio.toFixed(2)}:1 entre ${textColor} y ${bgColor}`);
    }
    
    return { ratio, accessible };
  };

  // Function to properly format social media URLs
  const formatSocialUrl = (input: string, platform: string): string => {
    if (!input) return '';
    
    // Remove leading @ symbol if present
    let cleanInput = input.replace(/^@/, '');
    
    // If already a complete URL, return as is
    if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
      return cleanInput;
    }
    
    // Remove platform domain if user included it
    const platformDomains = {
      instagram: /^(instagram\.com\/|www\.instagram\.com\/)/i,
      linkedin: /^(linkedin\.com\/in\/|www\.linkedin\.com\/in\/)/i,
      twitter: /^(twitter\.com\/|www\.twitter\.com\/|x\.com\/|www\.x\.com\/)/i,
      facebook: /^(facebook\.com\/|www\.facebook\.com\/)/i
    };
    
    if (platformDomains[platform as keyof typeof platformDomains]) {
      cleanInput = cleanInput.replace(platformDomains[platform as keyof typeof platformDomains], '');
    }
    
    // Build proper URL based on platform
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${cleanInput}`;
      case 'linkedin':
        return `https://linkedin.com/in/${cleanInput}`;
      case 'twitter':
        return `https://x.com/${cleanInput}`;
      case 'facebook':
        return `https://facebook.com/${cleanInput}`;
      default:
        return cleanInput.startsWith('http') ? cleanInput : `https://${cleanInput}`;
    }
  };

  // Function to format WhatsApp numbers
  const formatWhatsAppUrl = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // If number doesn't start with country code, assume Chile (+56)
    if (!cleanNumber.startsWith('56') && cleanNumber.length >= 8) {
      cleanNumber = '56' + cleanNumber;
    }
    
    return `https://wa.me/${cleanNumber}`;
  };

  // Function to ensure URLs have proper protocol
  const ensureHttps = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Definir estilos de plantillas visuales
  const getTemplateStyles = (templateId: string) => {
    const templates = {
      modern: {
        cardStyle: {
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
        headerStyle: {
          textAlign: 'center' as const,
          marginBottom: '1.5rem',
        },
        nameStyle: {
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        titleStyle: {
          fontSize: '1.1rem',
          fontWeight: '500',
          opacity: 0.9,
          marginBottom: '1rem',
        },
        photoStyle: {
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        },
      },
      elegant: {
        cardStyle: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        headerStyle: {
          textAlign: 'left' as const,
          marginBottom: '2rem',
          borderBottom: '2px solid',
          paddingBottom: '1rem',
        },
        nameStyle: {
          fontSize: '2rem',
          fontWeight: '300',
          marginBottom: '0.25rem',
          letterSpacing: '1px',
        },
        titleStyle: {
          fontSize: '1rem',
          fontWeight: '400',
          opacity: 0.8,
          fontStyle: 'italic',
          marginBottom: '1.5rem',
        },
        photoStyle: {
          borderRadius: '8px',
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        },
      },
      creative: {
        cardStyle: {
          borderRadius: '25px',
          boxShadow: '0 12px 40px rgba(31, 38, 135, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        },
        headerStyle: {
          textAlign: 'center' as const,
          marginBottom: '2rem',
          position: 'relative' as const,
        },
        nameStyle: {
          fontSize: '2.2rem',
          fontWeight: '800',
          marginBottom: '0.5rem',
          background: 'linear-gradient(45deg, #00F6FF, #0072ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          // Fallback para cuando hay glassmorphism
          color: 'transparent',
        },
        titleStyle: {
          fontSize: '1.2rem',
          fontWeight: '600',
          opacity: 1,
          marginBottom: '1rem',
          textTransform: 'uppercase' as const,
          letterSpacing: '2px',
        },
        photoStyle: {
          borderRadius: '50%',
          border: '6px solid',
          borderImage: 'linear-gradient(45deg, #00F6FF, #0072ff) 1',
          boxShadow: '0 8px 24px rgba(0,246,255,0.3)',
        },
      },
      classic: {
        cardStyle: {
          borderRadius: '8px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        },
        headerStyle: {
          textAlign: 'center' as const,
          marginBottom: '1.5rem',
          padding: '1rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        },
        nameStyle: {
          fontSize: '1.6rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          fontFamily: 'serif',
        },
        titleStyle: {
          fontSize: '1rem',
          fontWeight: '400',
          opacity: 0.85,
          marginBottom: '1rem',
        },
        photoStyle: {
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.1)',
        },
      },
    };
    
    return templates[templateId as keyof typeof templates] || templates.modern;
  };

  // Function to generate professional WhatsApp share messages based on profession
  const generateCreativeWhatsAppMessage = (name: string, profession: string, about: string): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    // Clean and format the about text for better presentation
    const formatAbout = (text: string) => {
      if (!text) return '';
      // Clean up the text and limit to reasonable length
      return text.length > 200 ? text.substring(0, 200) + '...' : text;
    };

    const formattedAbout = formatAbout(about);
    
    // Professional templates following the Andrés Astorga format
    const templates = {
      // Medical professionals
      doctor: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información para agendar una cita y contactarlo aquí: ${baseUrl}`,

      psicologo: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información para agendar una cita y contactarlo aquí: ${baseUrl}`,

      // Legal professionals  
      abogado: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información para contactarlo y conocer sus servicios legales aquí: ${baseUrl}`,

      // Tech professionals
      desarrollador: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios y proyectos aquí: ${baseUrl}`,

      ingeniero: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios profesionales aquí: ${baseUrl}`,

      // Business professionals
      consultor: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios de consultoría aquí: ${baseUrl}`,

      contador: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios contables y financieros aquí: ${baseUrl}`,

      // Creative professionals
      diseñador: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás todo su portafolio y información de contacto aquí: ${baseUrl}`,

      arquitecto: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus proyectos y servicios aquí: ${baseUrl}`,

      chef: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios culinarios aquí: ${baseUrl}`,

      profesor: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios educativos aquí: ${baseUrl}`,

      fotografo: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás todo su portafolio y información para sesiones aquí: ${baseUrl}`,

      marketing: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios de marketing aquí: ${baseUrl}`,

      // Default professional template
      default: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información para contactarlo y conocer sus servicios aquí: ${baseUrl}`
    };

    // Detect profession type
    const professionLower = profession.toLowerCase();
    
    if (professionLower.includes('doctor') || professionLower.includes('médico') || professionLower.includes('dra') || professionLower.includes('dr.')) {
      return templates.doctor;
    } else if (professionLower.includes('abogado') || professionLower.includes('legal') || professionLower.includes('derecho')) {
      return templates.abogado;
    } else if (professionLower.includes('desarrollador') || professionLower.includes('developer') || professionLower.includes('programador')) {
      return templates.desarrollador;
    } else if (professionLower.includes('ingeniero') || professionLower.includes('engineer')) {
      return templates.ingeniero;
    } else if (professionLower.includes('consultor') || professionLower.includes('consultant')) {
      return templates.consultor;
    } else if (professionLower.includes('contador') || professionLower.includes('contable') || professionLower.includes('financiero')) {
      return templates.contador;
    } else if (professionLower.includes('diseñador') || professionLower.includes('designer')) {
      return templates.diseñador;
    } else if (professionLower.includes('arquitecto') || professionLower.includes('architect')) {
      return templates.arquitecto;
    } else if (professionLower.includes('psicólogo') || professionLower.includes('psicologo') || professionLower.includes('psychologist')) {
      return templates.psicologo;
    } else if (professionLower.includes('chef') || professionLower.includes('cocinero') || professionLower.includes('gastronom')) {
      return templates.chef;
    } else if (professionLower.includes('profesor') || professionLower.includes('teacher') || professionLower.includes('educador') || professionLower.includes('docente')) {
      return templates.profesor;
    } else if (professionLower.includes('fotógrafo') || professionLower.includes('fotografo') || professionLower.includes('photographer')) {
      return templates.fotografo;
    } else if (professionLower.includes('marketing') || professionLower.includes('publicista') || professionLower.includes('community manager')) {
      return templates.marketing;
    } else {
      return templates.default;
    }
  };

  // Sistema inteligente de combinación de efectos sin conflictos
  const getCombinedEffectsStyles = (
    template: string,
    effects: {
      hover: boolean;
      glass: boolean;
      animations: boolean;
      patterns: boolean;
    }
  ) => {
    const baseTemplate = getTemplateStyles(template);
    
    // Base styles siempre aplicados
    const baseStyles = {
      width: '100%',
      maxWidth: '480px',
      color: cardTextColor,
      transition: 'all 0.3s ease-in-out',
      padding: '40px',
      margin: '0 auto',
      '--button-secondary-color': buttonSecondaryColor,
      '--button-normal-bg-color': buttonNormalBackgroundColor,
      '--button-secondary-hover-color': buttonSecondaryHoverColor,
      '--button-hover-text-color': getContrastTextColor(buttonSecondaryHoverColor),
    };

    // Determinar color de fondo inteligentemente
    let backgroundColor = cardBackgroundColor;
    let backdropFilter = 'none';
    let border = baseTemplate.cardStyle.border || 'none';
    
    if (effects.glass) {
      // Glassmorphism: manejar tanto colores sólidos como gradientes
      if (cardBackgroundColor.startsWith('linear-gradient')) {
        // Para gradientes, mantener el gradiente original con ligero overlay
        backgroundColor = cardBackgroundColor;
        backdropFilter = 'blur(8px) saturate(1.2)';
        border = '1px solid rgba(255, 255, 255, 0.2)';
      } else {
        // Para colores sólidos, aplicar transparencia
        const rgb = cardBackgroundColor.startsWith('#') 
          ? hexToRgb(cardBackgroundColor) 
          : parseRgb(cardBackgroundColor);
        
        if (rgb) {
          backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;
          backdropFilter = 'blur(12px) saturate(1.8)';
          border = `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
        }
      }
    }

    // Combinar box-shadow de template, hover y glass
    let boxShadow = baseTemplate.cardStyle.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.1)';
    
    if (effects.hover && effects.glass) {
      // Combinación hover + glass
      boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(31, 38, 135, 0.4)';
    } else if (effects.hover) {
      // Solo hover
      boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
    } else if (effects.glass) {
      // Solo glass - mantener sombra de template pero más sutil
      const templateShadow = baseTemplate.cardStyle.boxShadow;
      boxShadow = templateShadow || '0 8px 32px rgba(31, 38, 135, 0.3)';
    }

    // Transform base - hover se maneja via CSS :hover pseudo-class
    let transform = 'translateY(0)';
    // NO aplicamos transform permanente para hover - se maneja en CSS

    // Animaciones inteligentes - evitar duplicación con background patterns
    let animation = 'none';
    if (effects.animations && !effects.patterns) {
      // Solo fadeIn si no hay patterns (patterns ya tienen su propia animación)
      animation = 'fadeIn 1s ease-out';
    } else if (effects.animations && effects.patterns) {
      // Para patterns, solo agregamos fadeIn inicial, gradientAnimation viene de la clase CSS
      animation = 'fadeIn 1.2s ease-out';
    }

    // Combinar borderRadius - prioridad: glass > template
    let borderRadius = baseTemplate.cardStyle.borderRadius || '12px';
    if (effects.glass) {
      // Glass effect funciona mejor con bordes más redondeados
      const templateRadius = parseInt(baseTemplate.cardStyle.borderRadius || '12');
      borderRadius = `${Math.max(templateRadius, 16)}px`;
    }

    return {
      ...baseStyles,
      backgroundColor,
      backdropFilter,
      border,
      borderRadius,
      boxShadow,
      transform,
      animation,
      // Mantener propiedades específicas de template que no conflictúan
      ...Object.fromEntries(
        Object.entries(baseTemplate.cardStyle).filter(([key]) => 
          !['backgroundColor', 'backdropFilter', 'border', 'borderRadius', 'boxShadow', 'transform', 'animation'].includes(key)
        )
      ),
    } as React.CSSProperties & Record<string, string>;
  };

  // Función helper para convertir hex a rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Función helper para parsear rgb
  const parseRgb = (rgb: string) => {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match ? {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    } : null;
  };

  // Obtener estilos de la plantilla seleccionada
  const templateStyles = getTemplateStyles(template);

  // Aplicar sistema inteligente de efectos
  const cardStyles = getCombinedEffectsStyles(template, {
    hover: enableHoverEffect,
    glass: enableGlassmorphism,
    animations: enableSubtleAnimations,
    patterns: enableBackgroundPatterns
  });

  // DEBUG: Log de estilos finales aplicados
  console.log('🎨 Final card styles:', {
    backgroundColor: cardStyles.backgroundColor,
    backdropFilter: cardStyles.backdropFilter,
    originalCardBackgroundColor: cardBackgroundColor
  });

  // Generar clases CSS dinámicas para efectos combinados
  const getCardClasses = () => {
    let classes = ['text-center', 'business-card-custom'];
    
    // Agregar clases según efectos activos - orden importa para CSS specificity
    if (enableBackgroundPatterns) {
      classes.push('animated-gradient-background');
    }
    
    if (enableGlassmorphism) {
      classes.push('glass-shimmer');
    }
    
    if (enableHoverEffect) {
      classes.push('enhanced-hover');
    }
    
    // Lógica mejorada para animaciones
    if (enableSubtleAnimations) {
      if (enableBackgroundPatterns) {
        classes.push('fade-in-with-patterns');
        // La combinación específica se maneja en CSS con .animated-gradient-background.fade-in-with-patterns
      } else {
        classes.push('fade-in-active');
      }
    }
    
    return classes.join(' ');
  };

  return (
    <>
      <style>{staticStyles}</style>
      <Card className={getCardClasses()} style={cardStyles}>
        <Card.Body style={{ padding: 0 }}>
          <Stack gap={3}>
            <div className="header-section" style={templateStyles.headerStyle}>
              <div style={{ 
                position: 'relative',
                width: '120px', 
                height: '120px',
                margin: '0 auto 20px auto',
                overflow: 'hidden',
                ...templateStyles.photoStyle,
                borderColor: `${cardTextColor}33`,
              }}>
                <Image
                  src={photoUrl}
                  alt="Foto del Profesional"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="120px"
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
              <Card.Title as="h1" className="mb-2" style={{
                lineHeight: 1.2,
                // Para template creative, no aplicar cardTextColor para preservar gradiente
                color: template === 'creative' ? 'transparent' : cardTextColor,
                ...templateStyles.nameStyle
              }}>
                {name}
              </Card.Title>
              <Card.Subtitle as="h2" style={{
                color: cardTextColor,
                ...templateStyles.titleStyle
              }}>
                {title}
              </Card.Subtitle>
            </div>

            {about && (
              <div className="about-section text-start" style={{ 
                borderTop: `1px solid ${cardTextColor}33`,
                paddingTop: '20px',
                marginTop: '20px'
              }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8, marginBottom: '15px' }}>SOBRE MÍ</h3>
                <p className="mb-0" style={{ 
                  opacity: 0.9, 
                  textAlign: 'justify', 
                  fontSize: '0.95em',
                  lineHeight: 1.5
                }}>{about}</p>
              </div>
            )}

            <Stack gap={2} className="actions-section" style={{ 
              borderTop: `1px solid ${cardTextColor}33`,
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              {appointmentLink && (
                <Button href={ensureHttps(appointmentLink)} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Agendar una Cita
                </Button>
              )}
              {whatsapp && (
                <Button href={formatWhatsAppUrl(whatsapp)} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Contactar por WhatsApp
                </Button>
              )}
              {email && (
                <Button href={`mailto:${email}`} className="btn-outline-secondary-custom">
                  Enviar Email
                </Button>
              )}
              {linkedin && (
                <Button href={formatSocialUrl(linkedin, 'linkedin')} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  LinkedIn
                </Button>
              )}
              {instagram && (
                <Button href={formatSocialUrl(instagram, 'instagram')} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Instagram
                </Button>
              )}
              {twitter && (
                <Button href={formatSocialUrl(twitter, 'twitter')} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  X (Twitter)
                </Button>
              )}
              {facebook && (
                <Button href={formatSocialUrl(facebook, 'facebook')} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Facebook
                </Button>
              )}
            </Stack>

            {professionalDetails && (
              <div className="extra-info text-start" style={{ 
                borderTop: `1px solid ${cardTextColor}33`, 
                paddingTop: '20px',
                marginTop: '20px'
              }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8, marginBottom: '15px' }}>DETALLES PROFESIONALES</h3>
                <p className="mb-0" style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontSize: '0.95em',
                  lineHeight: 1.5,
                  opacity: 0.9
                }}>{professionalDetails}</p>
              </div>
            )}

            {location && (
              <div className="location-section text-start" style={{ 
                borderTop: `1px solid ${cardTextColor}33`,
                paddingTop: '20px',
                marginTop: '20px'
              }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8, marginBottom: '15px' }}>UBICACIÓN</h3>
                <p className="mb-3" style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontSize: '0.95em',
                  lineHeight: 1.5,
                  opacity: 0.9
                }}>{location}</p>
                <Button href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary-custom">
                  Ver en Mapa
                </Button>
              </div>
            )}

            <div className="share-section text-center" style={{ 
              borderTop: `1px solid ${cardTextColor}33`,
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8, marginBottom: '20px' }}>COMPARTE ESTA TARJETA</h3>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <QrCodeDisplay value={qrCodeValue} size={140} level="H" />
              </div>
              <Button 
                href={`https://wa.me/?text=${encodeURIComponent(generateCreativeWhatsAppMessage(name, title, about))}`}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  backgroundColor: '#25D366', 
                  borderColor: '#25D366', 
                  color: 'white', 
                  fontWeight: 500,
                  padding: '12px 24px',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Compartir por WhatsApp
              </Button>
            </div>
          </Stack>
        </Card.Body>
      </Card>
    </>
  );
}