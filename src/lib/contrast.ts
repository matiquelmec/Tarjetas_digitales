/**
 * Utilidades de contraste y accesibilidad para la Plataforma Digital Profesional
 * Garantiza que todos los textos tengan contraste adecuado según estándares WCAG
 */

/**
 * Calcula la luminancia relativa de un color
 * @param hexColor Color en formato hexadecimal (#ffffff)
 * @returns Valor de luminancia entre 0 y 1
 */
export function getRelativeLuminance(hexColor: string): number {
  if (!hexColor || hexColor.toLowerCase() === 'transparent') return 0;
  
  // Skip luminance calculation for gradients, rgba, or complex colors
  if (hexColor.includes('gradient') || hexColor.includes('rgba') || 
      (!hexColor.startsWith('#') && !hexColor.startsWith('rgb'))) {
    return 0.5; // Return neutral luminance for complex colors
  }
  
  // Remover # si existe
  const hex = hexColor.replace('#', '');
  
  // Validar que sea un hex válido
  if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) {
    return 0.5; // Return neutral luminance for invalid hex
  }
  
  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Aplicar gamma correction
  const getRGB = (color: number) => {
    return color <= 0.03928 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4);
  };
  
  // Calcular luminancia relativa
  return 0.2126 * getRGB(r) + 0.7152 * getRGB(g) + 0.0722 * getRGB(b);
}

/**
 * Calcula el ratio de contraste entre dos colores
 * @param color1 Primer color en hexadecimal
 * @param color2 Segundo color en hexadecimal
 * @returns Ratio de contraste (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (lightest + 0.05) / (darkest + 0.05);
}

/**
 * Determina el mejor color de texto (blanco o negro) para un fondo dado
 * @param backgroundColor Color de fondo en hexadecimal
 * @returns Color de texto óptimo (#ffffff o #000000)
 */
export function getBestTextColor(backgroundColor: string): string {
  // Handle gradients and complex colors with intelligent defaults
  if (backgroundColor.includes('gradient')) {
    // Extract first color from gradient to make decision
    const colorMatch = backgroundColor.match(/#[0-9a-fA-F]{6}/);
    if (colorMatch) {
      return getBestTextColor(colorMatch[0]);
    }
    // Default to white for dark-looking gradients
    return '#ffffff';
  }
  
  // Handle rgba colors
  if (backgroundColor.includes('rgba')) {
    // Default to white for rgba (usually used on dark backgrounds)
    return '#ffffff';
  }
  
  // Handle regular colors
  const whiteContrast = getContrastRatio(backgroundColor, '#ffffff');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

/**
 * Verifica si una combinación de colores cumple con estándares WCAG
 * @param textColor Color del texto
 * @param backgroundColor Color de fondo
 * @param level Nivel WCAG ('AA' | 'AAA')
 * @param size Tamaño del texto ('normal' | 'large')
 * @returns Si cumple con el estándar
 */
export function isAccessible(
  textColor: string, 
  backgroundColor: string, 
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(textColor, backgroundColor);
  
  const requirements = {
    'AA': { normal: 4.5, large: 3.0 },
    'AAA': { normal: 7.0, large: 4.5 }
  };
  
  return ratio >= requirements[level][size];
}

/**
 * Genera una versión más clara u oscura de un color
 * @param hexColor Color base
 * @param amount Cantidad de cambio (-100 a 100)
 * @returns Color modificado
 */
export function adjustBrightness(hexColor: string, amount: number): string {
  const hex = hexColor.replace('#', '');
  const num = parseInt(hex, 16);
  
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Configuraciones de contraste predefinidas para la plataforma
 */
export const CONTRAST_PRESETS = {
  // Para fondos con gradiente animado
  GRADIENT_BACKGROUND: {
    primaryText: '#ffffff',
    secondaryText: 'rgba(255, 255, 255, 0.85)',
    mutedText: 'rgba(255, 255, 255, 0.7)',
    hintText: 'rgba(255, 255, 255, 0.6)',
  },
  
  // Para glass cards
  GLASS_CARD: {
    primaryText: '#ffffff',
    secondaryText: 'rgba(255, 255, 255, 0.9)',
    mutedText: 'rgba(255, 255, 255, 0.75)',
    hintText: 'rgba(255, 255, 255, 0.65)',
  },
  
  // Para fondos sólidos blancos
  SOLID_WHITE: {
    primaryText: '#1a1a1a',
    secondaryText: '#2d2d2d',
    mutedText: '#6c757d',
    hintText: '#9ca3af',
  },
  
  // Para fondos sólidos oscuros
  SOLID_DARK: {
    primaryText: '#ffffff',
    secondaryText: '#f8f9fa',
    mutedText: '#dee2e6',
    hintText: '#adb5bd',
  }
};

/**
 * Aplicar clases CSS dinámicas para contraste óptimo
 */
export function getContrastClasses(backgroundColor: string): string {
  const textColor = getBestTextColor(backgroundColor);
  const isLight = textColor === '#000000';
  
  return isLight 
    ? 'text-dark text-secondary text-muted' 
    : 'text-white text-white-secondary text-white-muted';
}

/**
 * Generar estilos CSS para contraste óptimo
 */
export function getContrastStyles(backgroundColor: string) {
  const textColor = getBestTextColor(backgroundColor);
  const isLight = textColor === '#000000';
  
  if (isLight) {
    return {
      primary: '#1a1a1a',
      secondary: '#2d2d2d',
      muted: '#6c757d',
      hint: '#9ca3af'
    };
  } else {
    return {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.9)',
      muted: 'rgba(255, 255, 255, 0.75)',
      hint: 'rgba(255, 255, 255, 0.65)'
    };
  }
}