'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type IndiState = 'normal' | 'thinking' | 'success' | 'error' | 'greeting' | 'celebrating';

interface IndiContextType {
  currentState: IndiState;
  message: string | null;
  isVisible: boolean;
  
  // Actions
  setState: (state: IndiState) => void;
  setMessage: (message: string, duration?: number) => void;
  clearMessage: () => void;
  show: () => void;
  hide: () => void;
  
  // Contextual actions
  greetUser: (userName?: string) => void;
  celebrate: (achievement: string) => void;
  think: () => void;
  showError: (errorMessage: string) => void;
  showSuccess: (successMessage: string) => void;
}

const IndiContext = createContext<IndiContextType | undefined>(undefined);

// Provider para el contexto de Indi
export const IndiProvider = ({ children }: { children: ReactNode }) => {
  const [currentState, setCurrentStateRaw] = useState<IndiState>('normal');
  const [message, setMessageRaw] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const setState = useCallback((state: IndiState) => {
    setCurrentStateRaw(state);
  }, []);

  const setMessage = useCallback((msg: string, duration = 3000) => {
    setMessageRaw(msg);
    if (duration > 0) {
      setTimeout(() => {
        setMessageRaw(null);
      }, duration);
    }
  }, []);

  const clearMessage = useCallback(() => {
    setMessageRaw(null);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const greetUser = useCallback((userName?: string) => {
    const greeting = userName ? `¡Hola ${userName}! 👋` : '¡Hola terrícola! 👋';
    setCurrentStateRaw('greeting');
    setMessageRaw(greeting);
    setTimeout(() => {
      setCurrentStateRaw('normal');
      setMessageRaw(null);
    }, 3000);
  }, []);

  const celebrate = useCallback((achievement: string) => {
    setCurrentStateRaw('celebrating');
    setMessageRaw(`🎉 ${achievement}`);
    setTimeout(() => {
      setCurrentStateRaw('normal');
      setMessageRaw(null);
    }, 2000);
  }, []);

  const think = useCallback(() => {
    setCurrentStateRaw('thinking');
    setMessageRaw('Analizando datos intergalácticos...');
  }, []);

  const showError = useCallback((errorMessage: string) => {
    setCurrentStateRaw('error');
    setMessageRaw(`¡Ops! ${errorMessage}`);
    setTimeout(() => {
      setCurrentStateRaw('normal');
      setMessageRaw(null);
    }, 4000);
  }, []);

  const showSuccess = useCallback((successMessage: string) => {
    setCurrentStateRaw('success');
    setMessageRaw(`✨ ${successMessage}`);
    setTimeout(() => {
      setCurrentStateRaw('normal');
      setMessageRaw(null);
    }, 3000);
  }, []);

  const value: IndiContextType = {
    currentState,
    message,
    isVisible,
    setState,
    setMessage,
    clearMessage,
    show,
    hide,
    greetUser,
    celebrate,
    think,
    showError,
    showSuccess,
  };

  return (
    <IndiContext.Provider value={value}>
      {children}
    </IndiContext.Provider>
  );
};

// Hook personalizado para usar Indi en componentes
export const useIndi = () => {
  const context = useContext(IndiContext);
  
  if (!context) {
    throw new Error('useIndi debe ser usado dentro de un IndiProvider');
  }
  
  return {
    ...context,
    
    // Helpers adicionales
    triggerOnboarding: () => {
      context.setState('greeting');
      context.setMessage('¡Bienvenido! Soy Indi, tu guía intergaláctico 🛸');
    },
    
    triggerCardCreated: () => {
      context.celebrate('¡Tarjeta creada exitosamente!');
    },
    
    triggerLoading: (action = 'procesando') => {
      context.think();
      context.setMessage(`Indi está ${action}...`, 0);
    },
    
    triggerPlanUpgrade: () => {
      context.setState('success');
      context.setMessage('¡Genial! Tu plan ha sido actualizado 🚀');
    },
    
    // Context-aware reactions
    reactToUserAction: (action: 'create' | 'edit' | 'delete' | 'share' | 'upgrade') => {
      switch (action) {
        case 'create':
          context.setState('success');
          context.setMessage('¡Indi está impresionado con tu creación! ✨');
          break;
        case 'edit':
          context.setState('thinking');
          context.setMessage('Indi observa tus mejoras...');
          break;
        case 'delete':
          context.setState('normal');
          context.setMessage('Indi comprende, a veces hay que empezar de nuevo 🔄');
          break;
        case 'share':
          context.celebrate('¡Compartiendo con el universo!');
          break;
        case 'upgrade':
          context.triggerPlanUpgrade();
          break;
      }
    }
  };
};

// Hook específico para mensajes contextuales
export const useIndiMessages = () => {
  const context = useContext(IndiContext);
  
  if (!context) {
    throw new Error('useIndiMessages debe ser usado dentro de un IndiProvider');
  }
  
  const { setMessage, clearMessage } = context;
  
  const contextualMessages = {
    onboarding: [
      '¡Hola! Soy Indi, tu embajador intergaláctico 🛸',
      'Te ayudaré a crear una identidad digital única',
      '¡Vamos a transformar tu presencia profesional!'
    ],
    
    cardEditor: [
      'Indi sugiere probar efectos glassmorphism ✨',
      'Esta paleta de colores es perfecta para networking 🎨',
      '¡Tu tarjeta está quedando increíble! 🌟'
    ],
    
    dashboard: [
      'Indi nota que podrías crear más tarjetas 💡',
      'Tus métricas están mejorando 📈',
      '¿Listo para el siguiente nivel? 🚀'
    ],
    
    empty_states: [
      'Indi sugiere empezar con una tarjeta básica 👽',
      '¡El universo espera tu primera creación! 🌌',
      'Tu viaje intergaláctico comienza aquí ✨'
    ]
  };
  
  return {
    showContextualMessage: (context: keyof typeof contextualMessages) => {
      const messages = contextualMessages[context];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMessage, 4000);
    },
    
    showRandomTip: () => {
      const tips = [
        'Indi tip: Los efectos sutiles generan más impacto 💫',
        'Indi recomienda: Mantén tu información actualizada 🔄',
        'Dato intergaláctico: Las tarjetas simples convierten más 📊',
        'Indi observa: Tu networking está evolucionando 🌟'
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setMessage(randomTip, 5000);
    }
  };
};

export default useIndi;