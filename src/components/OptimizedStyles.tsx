'use client';

import { useEffect } from 'react';

export function OptimizedStyles() {
  useEffect(() => {
    // Load only essential Bootstrap CSS dynamically after component mounts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    link.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
    link.crossOrigin = 'anonymous';
    
    // Load asynchronously to avoid render blocking
    link.media = 'print';
    link.onload = function() {
      (this as HTMLLinkElement).media = 'all';
    };
    
    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'stylesheet';
    fallbackLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    noscript.appendChild(fallbackLink);
    
    document.head.appendChild(link);
    document.head.appendChild(noscript);
    
    return () => {
      // Cleanup on unmount
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(noscript)) {
        document.head.removeChild(noscript);
      }
    };
  }, []);

  return null;
}