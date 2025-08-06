// Presentation Theme System - Extended from card themes
export interface PresentationTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'professional' | 'creative' | 'executive' | 'natural' | 'tech' | 'custom';
  isPremium: boolean;
  
  // Core colors
  colors: {
    primary: string;          // Main background/brand color
    secondary: string;        // Accent color for highlights
    accent: string;           // Interactive elements (buttons, links)
    background: string;       // Slide background (can be gradient)
    surface: string;          // Card/content backgrounds
    text: {
      primary: string;        // Main text color
      secondary: string;      // Subtitle/secondary text
      accent: string;         // Highlighted text
      onDark: string;         // Text on dark backgrounds
      onLight: string;        // Text on light backgrounds
    };
  };
  
  // Typography
  fonts: {
    heading: {
      family: string;
      weight: number;
      size: {
        h1: string;
        h2: string;
        h3: string;
      };
    };
    body: {
      family: string;
      weight: number;
      size: {
        large: string;
        medium: string;
        small: string;
      };
    };
  };
  
  // Slide-specific styling
  slide: {
    borderRadius: string;
    shadow: string;
    border: string;
    padding: string;
    maxWidth: string;
  };
  
  // Animations and effects
  effects: {
    glassmorphism: boolean;
    particles: boolean;
    shadows: boolean;
    gradients: boolean;
    animations: {
      transition: string;
      duration: string;
      easing: string;
    };
  };
  
  // Layout presets
  layouts: {
    titleSlide: SlideLayout;
    contentSlide: SlideLayout;
    imageSlide: SlideLayout;
    chartSlide: SlideLayout;
    conclusionSlide: SlideLayout;
  };
}

export interface SlideLayout {
  name: string;
  structure: 'centered' | 'left-aligned' | 'two-column' | 'hero' | 'minimal';
  contentAlignment: 'left' | 'center' | 'right';
  imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background';
  spacing: {
    title: string;
    content: string;
    footer: string;
  };
}

// Extended color system for presentations
export interface PresentationColorSystem {
  primary: ColorVariants;
  secondary: ColorVariants;
  accent: ColorVariants;
  neutral: ColorVariants;
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface ColorVariants {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;  // Main color
  600: string;
  700: string;
  800: string;
  900: string;
}

// Preset themes adapted from card system
export const PRESENTATION_THEMES: PresentationTheme[] = [
  // Professional Themes
  {
    id: 'corporate-executive',
    name: 'Corporate Executive',
    emoji: '💼',
    description: 'Autoridad y confianza institucional para presentaciones ejecutivas',
    category: 'professional',
    isPremium: true,
    colors: {
      primary: '#1a237e',
      secondary: '#283593',
      accent: '#7986cb',
      background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: {
        primary: '#ffffff',
        secondary: '#e8eaf6',
        accent: '#7986cb',
        onDark: '#ffffff',
        onLight: '#1a237e'
      }
    },
    fonts: {
      heading: {
        family: '"Playfair Display", serif',
        weight: 700,
        size: { h1: '3.5rem', h2: '2.5rem', h3: '1.8rem' }
      },
      body: {
        family: '"Inter", sans-serif',
        weight: 400,
        size: { large: '1.25rem', medium: '1rem', small: '0.875rem' }
      }
    },
    slide: {
      borderRadius: '20px',
      shadow: '0 20px 60px rgba(26, 35, 126, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '3rem',
      maxWidth: '1200px'
    },
    effects: {
      glassmorphism: true,
      particles: false,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        duration: '600ms',
        easing: 'ease-in-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Executive Title',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      contentSlide: {
        name: 'Professional Content',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      imageSlide: {
        name: 'Executive Image',
        structure: 'two-column',
        contentAlignment: 'left',
        imagePosition: 'right',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      chartSlide: {
        name: 'Data Presentation',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1rem', content: '2rem', footer: '1rem' }
      },
      conclusionSlide: {
        name: 'Executive Summary',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      }
    }
  },
  
  {
    id: 'tech-innovation',
    name: 'Tech Innovation',
    emoji: '⚡',
    description: 'Futuro, precisión e innovación tecnológica',
    category: 'tech',
    isPremium: false,
    colors: {
      primary: '#0d1421',
      secondary: '#1a252f',
      accent: '#64ffda',
      background: 'linear-gradient(135deg, #0d1421 0%, #1a252f 50%, #263238 100%)',
      surface: 'rgba(255, 255, 255, 0.03)',
      text: {
        primary: '#e8f5e8',
        secondary: '#b0bec5',
        accent: '#64ffda',
        onDark: '#e8f5e8',
        onLight: '#0d1421'
      }
    },
    fonts: {
      heading: {
        family: '"JetBrains Mono", monospace',
        weight: 600,
        size: { h1: '3rem', h2: '2.25rem', h3: '1.75rem' }
      },
      body: {
        family: '"Space Grotesk", sans-serif',
        weight: 400,
        size: { large: '1.125rem', medium: '1rem', small: '0.875rem' }
      }
    },
    slide: {
      borderRadius: '16px',
      shadow: '0 25px 80px rgba(13, 20, 33, 0.4)',
      border: '1px solid rgba(100, 255, 218, 0.2)',
      padding: '2.5rem',
      maxWidth: '1200px'
    },
    effects: {
      glassmorphism: true,
      particles: true,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        duration: '400ms',
        easing: 'ease-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Tech Hero',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      contentSlide: {
        name: 'Code & Content',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      imageSlide: {
        name: 'Tech Visual',
        structure: 'hero',
        contentAlignment: 'left',
        imagePosition: 'background',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      chartSlide: {
        name: 'Data Analytics',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1rem', content: '2rem', footer: '1rem' }
      },
      conclusionSlide: {
        name: 'Innovation Summary',
        structure: 'minimal',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      }
    }
  },

  // Creative Themes
  {
    id: 'artist-canvas',
    name: 'Artist Canvas',
    emoji: '🎨',
    description: 'Creatividad, inspiración y expresión artística',
    category: 'creative',
    isPremium: true,
    colors: {
      primary: '#f8bbd9',
      secondary: '#e1bee7',
      accent: '#ad1457',
      background: 'linear-gradient(135deg, #f8bbd9 0%, #e1bee7 100%)',
      surface: 'rgba(45, 27, 78, 0.05)',
      text: {
        primary: '#2d1b4e',
        secondary: '#4a148c',
        accent: '#ad1457',
        onDark: '#f8bbd9',
        onLight: '#2d1b4e'
      }
    },
    fonts: {
      heading: {
        family: '"Crimson Text", serif',
        weight: 600,
        size: { h1: '3.25rem', h2: '2.5rem', h3: '1.875rem' }
      },
      body: {
        family: '"Source Sans Pro", sans-serif',
        weight: 400,
        size: { large: '1.25rem', medium: '1.125rem', small: '1rem' }
      }
    },
    slide: {
      borderRadius: '24px',
      shadow: '0 15px 40px rgba(248, 187, 217, 0.25)',
      border: '2px solid rgba(173, 20, 87, 0.1)',
      padding: '3rem',
      maxWidth: '1100px'
    },
    effects: {
      glassmorphism: false,
      particles: false,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        duration: '500ms',
        easing: 'ease-in-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Creative Hero',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2.5rem', content: '2rem', footer: '1.5rem' }
      },
      contentSlide: {
        name: 'Artistic Flow',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      imageSlide: {
        name: 'Visual Showcase',
        structure: 'hero',
        contentAlignment: 'center',
        imagePosition: 'background',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      chartSlide: {
        name: 'Creative Analytics',
        structure: 'two-column',
        contentAlignment: 'left',
        spacing: { title: '1.5rem', content: '1rem', footer: '0.5rem' }
      },
      conclusionSlide: {
        name: 'Artistic Conclusion',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      }
    }
  },

  // Executive Premium Themes
  {
    id: 'diamond',
    name: 'Diamond',
    emoji: '💎',
    description: 'Elegancia cristalina con destellos azul diamante',
    category: 'executive',
    isPremium: true,
    colors: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#64b5f6',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      surface: 'rgba(255, 255, 255, 0.06)',
      text: {
        primary: '#ffffff',
        secondary: '#e3f2fd',
        accent: '#64b5f6',
        onDark: '#ffffff',
        onLight: '#1a1a2e'
      }
    },
    fonts: {
      heading: {
        family: '"Montserrat", sans-serif',
        weight: 700,
        size: { h1: '3.75rem', h2: '2.75rem', h3: '2rem' }
      },
      body: {
        family: '"Open Sans", sans-serif',
        weight: 400,
        size: { large: '1.25rem', medium: '1rem', small: '0.875rem' }
      }
    },
    slide: {
      borderRadius: '20px',
      shadow: '0 30px 90px rgba(26, 26, 46, 0.5)',
      border: '1px solid rgba(100, 181, 246, 0.2)',
      padding: '3.5rem',
      maxWidth: '1300px'
    },
    effects: {
      glassmorphism: true,
      particles: true,
      shadows: true,
      gradients: true,
      animations: {
        transition: 'all 0.7s cubic-bezier(0.19, 1, 0.22, 1)',
        duration: '700ms',
        easing: 'ease-out'
      }
    },
    layouts: {
      titleSlide: {
        name: 'Diamond Title',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '3rem', content: '2rem', footer: '1.5rem' }
      },
      contentSlide: {
        name: 'Premium Content',
        structure: 'left-aligned',
        contentAlignment: 'left',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      imageSlide: {
        name: 'Luxury Visual',
        structure: 'two-column',
        contentAlignment: 'left',
        imagePosition: 'right',
        spacing: { title: '2rem', content: '1.5rem', footer: '1rem' }
      },
      chartSlide: {
        name: 'Executive Data',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '1.5rem', content: '2.5rem', footer: '1.5rem' }
      },
      conclusionSlide: {
        name: 'Diamond Summary',
        structure: 'centered',
        contentAlignment: 'center',
        spacing: { title: '2.5rem', content: '2rem', footer: '1.5rem' }
      }
    }
  }
];

// Helper functions
export const getThemeById = (id: string): PresentationTheme | undefined => {
  return PRESENTATION_THEMES.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: string): PresentationTheme[] => {
  return PRESENTATION_THEMES.filter(theme => theme.category === category);
};

export const getFreeThemes = (): PresentationTheme[] => {
  return PRESENTATION_THEMES.filter(theme => !theme.isPremium);
};

export const getPremiumThemes = (): PresentationTheme[] => {
  return PRESENTATION_THEMES.filter(theme => theme.isPremium);
};