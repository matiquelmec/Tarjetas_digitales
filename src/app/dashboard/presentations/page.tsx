'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import { AuthWrapper } from '@/components/AuthWrapper';
import IndiNavbar from '@/components/layout/IndiNavbar';
import SlidePreview from '@/features/presentations/components/SlidePreview';
import ThemeSelector from '@/features/presentations/components/ThemeSelector';
import IndiChat from '@/features/presentations/components/IndiChat';

export default function PresentationsPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [presentations, setPresentations] = useState<any[]>([]);
  const [currentPresentation, setCurrentPresentation] = useState<any>(null);
  const [currentSlides, setCurrentSlides] = useState([
    {
      id: '1',
      type: 'title' as const,
      content: {
        title: 'Mi Presentación Inmersiva',
        subtitle: 'Creada con tecnología intergaláctica'
      }
    }
  ]);
  const [selectedTheme, setSelectedTheme] = useState('stellar');
  const [presentationTitle, setPresentationTitle] = useState('Mi Presentación');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Cargar presentaciones al montar el componente
  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/presentations');
      if (!response.ok) {
        throw new Error('Error cargando presentaciones');
      }
      const data = await response.json();
      setPresentations(data.presentations || []);
    } catch (error) {
      console.error('Error loading presentations:', error);
      setError('Error cargando presentaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresentationGenerated = (presentation: any) => {
    if (presentation && presentation.slides) {
      setCurrentPresentation(presentation);
      setCurrentSlides(presentation.slides);
      setPresentationTitle(presentation.title);
      
      if (presentation.theme && typeof presentation.theme === 'object') {
        setSelectedTheme(presentation.theme.name || 'stellar');
      }
      
      // Cambiar a la pestaña de creación para mostrar el resultado
      setActiveTab('create');
      
      // Recargar la lista de presentaciones
      loadPresentations();
    }
  };

  const handleSavePresentation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const presentationData = {
        title: presentationTitle,
        description: currentPresentation?.description || 'Presentación creada con IA',
        slides: currentSlides,
        theme: typeof selectedTheme === 'string' 
          ? { name: selectedTheme, primaryColor: '#00f6ff', secondaryColor: '#0072ff', backgroundColor: '#0f0c29', fontFamily: 'Inter' }
          : selectedTheme,
        settings: {
          autoPlay: false,
          loop: false,
          showProgress: true,
          allowDownload: false,
          transitionEffect: 'slide'
        }
      };

      let response;
      
      if (currentPresentation && currentPresentation.id) {
        // Actualizar presentación existente
        response = await fetch(`/api/presentations/${currentPresentation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(presentationData)
        });
      } else {
        // Crear nueva presentación
        response = await fetch('/api/presentations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(presentationData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error guardando presentación');
      }

      const data = await response.json();
      setCurrentPresentation(data.presentation);
      
      // Recargar lista
      loadPresentations();
      
      alert('Presentación guardada exitosamente');

    } catch (error) {
      console.error('Error saving presentation:', error);
      setError(error instanceof Error ? error.message : 'Error guardando presentación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!currentPresentation || !currentPresentation.id) {
      alert('Guarda la presentación primero antes de exportar');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/presentations/${currentPresentation.id}/export?format=pdf`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error exportando PDF');
      }

      // Descargar el archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${presentationTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('PDF exportado exitosamente');

    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert(`Error exportando PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addSlide = (type: 'title' | 'content' | 'image' | 'chart' = 'content') => {
    const newSlide = {
      id: Date.now().toString(),
      type,
      content: type === 'title' 
        ? { title: 'Nuevo Título', subtitle: 'Subtítulo' }
        : type === 'content'
        ? { title: 'Nueva Diapositiva', content: 'Contenido de la diapositiva' }
        : type === 'image'
        ? { title: 'Imagen', imageUrl: 'https://via.placeholder.com/800x600', caption: 'Descripción de la imagen' }
        : { title: 'Gráfico', chartType: 'bar', data: [] }
    };
    setCurrentSlides([...currentSlides, newSlide]);
  };

  // Funciones para modo presentación
  const startPresentation = () => {
    if (currentSlides.length === 0) return;
    setCurrentSlideIndex(0);
    setIsFullscreen(true);
  };

  const exitPresentation = () => {
    setIsFullscreen(false);
    setCurrentSlideIndex(0);
  };

  const nextSlide = () => {
    if (currentSlideIndex < currentSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < currentSlides.length) {
      setCurrentSlideIndex(index);
    }
  };

  // Manejar teclas en modo presentación
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (event.key) {
        case 'ArrowRight':
        case 'Space':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'Escape':
          exitPresentation();
          break;
        case 'Home':
          goToSlide(0);
          break;
        case 'End':
          goToSlide(currentSlides.length - 1);
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isFullscreen, currentSlideIndex, currentSlides.length]);

  return (
    <AuthWrapper>
      <style jsx global>{`
        body {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          min-height: 100vh;
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }
        
        /* Nuevos estilos modernos */
        .presentations-header {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }
        
        .page-subtitle {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-size: 1.1rem;
        }
        
        .header-stats {
          text-align: center;
        }
        
        .stat-compact {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #00f6ff;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.25rem;
        }
        
        .modern-nav-tabs {
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
        }
        
        .modern-nav-tab {
          background: transparent;
          border: 1px solid transparent;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          margin: 0 4px;
          transition: all 0.3s ease;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
        }
        
        .modern-nav-tab:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .modern-nav-tab.active {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.3);
        }
        
        .slides-sidebar {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 1.5rem;
          height: fit-content;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .sidebar-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .sidebar-header h6 {
          margin: 0;
          color: #1a1a1a;
          font-weight: 600;
          flex: 1;
        }
        
        .btn-add-slide {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          color: white;
          border-radius: 8px;
          padding: 4px 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .btn-add-slide:hover {
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          color: white;
          transform: translateY(-1px);
        }
        
        .slides-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .slide-item {
          padding: 0.75rem;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .slide-item:hover {
          border-color: #00f6ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.2);
        }
        
        .slide-preview-mini {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .slide-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 246, 255, 0.1);
          border-radius: 8px;
        }
        
        .slide-info {
          flex: 1;
        }
        
        .slide-number {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 0.9rem;
        }
        
        .slide-type {
          color: #666;
          font-size: 0.8rem;
          margin-top: 2px;
        }
        
        .editor-main {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .editor-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        
        .toolbar-left h6 {
          margin: 0;
          color: #1a1a1a;
          font-weight: 600;
        }
        
        .presentation-title {
          color: #666;
          font-size: 0.9rem;
          margin-left: 0.5rem;
        }
        
        .toolbar-right {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-action {
          background: #6c757d;
          border: none;
          color: white;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .btn-action:hover {
          background: #5a6268;
          color: white;
          transform: translateY(-1px);
        }
        
        .slide-canvas {
          padding: 2rem;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
        }
        
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          margin: 2rem 0;
        }
        
        .empty-content {
          text-align: center;
          max-width: 400px;
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }
        
        .empty-content h4 {
          color: #1a1a1a;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        
        .empty-content p {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        
        .btn-primary-action {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 16px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.3);
        }
        
        .btn-primary-action:hover {
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 246, 255, 0.4);
        }
        
        .slides-container {
          max-height: 70vh;
          overflow-y: auto;
          padding-right: 10px;
        }
        
        .slides-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .slides-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .slides-container::-webkit-scrollbar-thumb {
          background: rgba(0, 246, 255, 0.5);
          border-radius: 3px;
        }
        
        .title-glow {
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2);
          background-size: 200% 200%;
          animation: titleShimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }
        
        @keyframes titleShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .slide-thumbnail {
          width: 100%;
          height: 120px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .slide-thumbnail:hover {
          border-color: #00f6ff;
          transform: scale(1.02);
          box-shadow: 0 4px 16px rgba(0, 246, 255, 0.3);
        }
        
        .slide-thumbnail.active {
          border-color: #00f6ff;
          background: rgba(0, 246, 255, 0.1);
          color: white;
        }
        
        /* Responsive */
        @media (max-width: 991px) {
          .presentations-header {
            padding: 1.5rem 1rem;
            text-align: center;
          }
          
          .page-title {
            font-size: 1.8rem;
          }
          
          .slides-sidebar {
            margin-bottom: 1.5rem;
          }
          
          .editor-toolbar {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .toolbar-right {
            justify-content: center;
          }
          
          .slide-canvas {
            padding: 1rem;
          }
        }
        
        @media (max-width: 576px) {
          .presentations-header {
            padding: 1rem;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
          
          .modern-nav-tabs {
            flex-direction: column;
            align-items: stretch;
          }
          
          .modern-nav-tab {
            margin: 2px 0;
            text-align: center;
          }
          
          .slides-sidebar {
            padding: 1rem;
          }
          
          .sidebar-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: stretch;
          }
          
          .empty-content {
            padding: 1rem;
          }
          
          .empty-icon {
            font-size: 3rem;
          }
        }
        
        /* Estilos para modo presentación fullscreen */
        .fullscreen-presentation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .presentation-overlay {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .presentation-slide {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .presentation-controls {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 90%;
          max-width: 800px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 1rem 2rem;
          transition: opacity 0.3s ease;
        }
        
        .controls-left,
        .controls-right {
          flex: 1;
        }
        
        .controls-center {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: center;
        }
        
        .control-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 12px;
          padding: 8px 12px;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          min-width: 40px;
        }
        
        .control-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          color: white;
          transform: translateY(-2px);
        }
        
        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .slide-counter {
          color: white;
          font-weight: 600;
          font-size: 1rem;
          min-width: 60px;
          text-align: center;
        }
        
        .slide-indicators {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        
        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .indicator:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: scale(1.2);
        }
        
        .indicator.active {
          background: #00f6ff;
          box-shadow: 0 0 10px rgba(0, 246, 255, 0.5);
        }
        
        .keyboard-hints {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          color: rgba(255, 255, 255, 0.8);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          backdrop-filter: blur(10px);
        }
        
        .btn-present {
          background: linear-gradient(135deg, #28a745, #20c997);
          border: none;
          color: white;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-present:hover:not(:disabled) {
          background: linear-gradient(135deg, #218838, #17a2b8);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }
        
        .btn-present:disabled {
          background: #6c757d;
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* Ocultar controles automáticamente después de unos segundos */
        .presentation-controls {
          animation: fadeInControls 0.5s ease;
        }
        
        @keyframes fadeInControls {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        
        /* Responsive para modo presentación */
        @media (max-width: 768px) {
          .presentation-controls {
            width: 95%;
            padding: 0.75rem 1rem;
            flex-direction: column;
            gap: 1rem;
          }
          
          .controls-left,
          .controls-right {
            flex: none;
          }
          
          .keyboard-hints {
            display: none;
          }
          
          .slide-indicators {
            justify-content: center;
          }
        }
      `}</style>
      
      {/* Navbar con Indi */}
      <IndiNavbar variant="transparent" position="relative" showActions={true} />
      
      <Container fluid className="py-4">
        {/* Header simplificado */}
        <div className="presentations-header">
          <Row className="align-items-center mb-4">
            <Col lg={8}>
              <div className="header-content">
                <h1 className="page-title">
                  📊 Presentaciones con IA
                </h1>
                <p className="page-subtitle">
                  Crea presentaciones profesionales con inteligencia artificial
                </p>
              </div>
            </Col>
            <Col lg={4} className="text-end">
              <div className="header-stats">
                <div className="stat-compact">
                  <span className="stat-number">{presentations.length}</span>
                  <span className="stat-label">Presentaciones</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || 'create')}>
          <Row className="mb-4">
            <Col>
              <Nav variant="pills" className="modern-nav-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="create" className="modern-nav-tab">
                    <span className="me-2">✨</span>
                    Editor
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ai-assistant" className="modern-nav-tab">
                    <span className="me-2">🤖</span>
                    Generar con IA
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="themes" className="modern-nav-tab">
                    <span className="me-2">🎨</span>
                    Temas
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>

          <Tab.Content>
            {/* Tab 1: Editor de Presentación */}
            <Tab.Pane eventKey="create">
              {currentSlides.length > 0 ? (
                <Row>
                  <Col lg={4}>
                    <div className="slides-sidebar">
                      <div className="sidebar-header">
                        <h6>Diapositivas ({currentSlides.length})</h6>
                        <div className="sidebar-actions">
                          <Button 
                            className="btn-add-slide" 
                            size="sm"
                            onClick={() => addSlide('content')}
                          >
                            <span className="me-1">+</span>
                            Agregar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="slides-list">
                        {currentSlides.map((slide, index) => (
                          <div 
                            key={slide.id} 
                            className="slide-item"
                          >
                            <div className="slide-preview-mini">
                              <div className="slide-icon">
                                {slide.type === 'title' && '📋'}
                                {slide.type === 'content' && '📄'}
                                {slide.type === 'bullets' && '📝'}
                                {slide.type === 'quote' && '💬'}
                                {slide.type === 'chart' && '📊'}
                              </div>
                              <div className="slide-info">
                                <div className="slide-number">Slide {index + 1}</div>
                                <div className="slide-type">
                                  {slide.type === 'title' ? 'Título' : 
                                   slide.type === 'content' ? 'Contenido' :
                                   slide.type === 'bullets' ? 'Lista' :
                                   slide.type === 'quote' ? 'Cita' : 'Gráfico'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                  
                  <Col lg={8}>
                    <div className="editor-main">
                      <div className="editor-toolbar">
                        <div className="toolbar-left">
                          <h6 className="mb-0">Vista Previa</h6>
                          <span className="presentation-title">{presentationTitle}</span>
                        </div>
                        <div className="toolbar-right">
                          <Button 
                            className="btn-action" 
                            size="sm"
                            onClick={handleSavePresentation}
                            disabled={isLoading}
                          >
                            <span className="me-2">💾</span>
                            {isLoading ? 'Guardando...' : 'Guardar'}
                          </Button>
                          <Button 
                            className="btn-action" 
                            size="sm"
                            disabled={!currentPresentation}
                            onClick={handleExportPDF}
                          >
                            <span className="me-2">📄</span>
                            PDF
                          </Button>
                          <Button 
                            className="btn-present" 
                            size="sm"
                            onClick={startPresentation}
                            disabled={currentSlides.length === 0}
                          >
                            <span className="me-2">▶️</span>
                            Presentar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="slide-canvas">
                        <SlidePreview
                          slide={currentSlides[0]}
                          theme={selectedTheme}
                          isPreview={true}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              ) : (
                <div className="empty-state">
                  <div className="empty-content">
                    <div className="empty-icon">📊</div>
                    <h4>¡Comencemos con tu presentación!</h4>
                    <p>Usa el asistente de IA para generar una presentación automáticamente o crea una desde cero.</p>
                    <Button 
                      className="btn-primary-action" 
                      onClick={() => setActiveTab('ai-assistant')}
                    >
                      <span className="me-2">🤖</span>
                      Generar con IA
                    </Button>
                  </div>
                </div>
              )}
            </Tab.Pane>

            {/* Tab 2: Temas y Diseño */}
            <Tab.Pane eventKey="themes">
              <Row>
                <Col>
                  <Card className="glass-card text-white">
                    <Card.Header className="border-0">
                      <h5 className="mb-0">🎨 Selector de Temas</h5>
                    </Card.Header>
                    <Card.Body>
                      <ThemeSelector
                        selectedTheme={selectedTheme}
                        onThemeChange={setSelectedTheme}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Tab 3: Asistente IA */}
            <Tab.Pane eventKey="ai-assistant">
              <Row>
                <Col>
                  <Card className="glass-card text-white">
                    <Card.Header className="border-0">
                      <h5 className="mb-0">🤖 Asistente IA - Indi</h5>
                      <p className="mb-0 small text-white-50">
                        Chatea con Indi para generar contenido y mejorar tu presentación
                      </p>
                    </Card.Header>
                    <Card.Body style={{ height: '600px', overflow: 'hidden' }}>
                      <IndiChat onPresentationGenerated={handlePresentationGenerated} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>

      {/* Modo Presentación Fullscreen */}
      {isFullscreen && (
        <div className="fullscreen-presentation">
          <div className="presentation-overlay">
            {/* Slide actual */}
            <div className="presentation-slide">
              <SlidePreview
                slide={currentSlides[currentSlideIndex]}
                theme={selectedTheme}
                isPreview={false}
              />
            </div>

            {/* Controles de presentación */}
            <div className="presentation-controls">
              <div className="controls-left">
                <Button 
                  className="control-btn"
                  onClick={exitPresentation}
                  title="Salir (Esc)"
                >
                  ✕
                </Button>
              </div>

              <div className="controls-center">
                <Button 
                  className="control-btn"
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                  title="Anterior (←)"
                >
                  ←
                </Button>
                
                <span className="slide-counter">
                  {currentSlideIndex + 1} / {currentSlides.length}
                </span>
                
                <Button 
                  className="control-btn"
                  onClick={nextSlide}
                  disabled={currentSlideIndex === currentSlides.length - 1}
                  title="Siguiente (→ o Espacio)"
                >
                  →
                </Button>
              </div>

              <div className="controls-right">
                <div className="slide-indicators">
                  {currentSlides.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentSlideIndex ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      title={`Ir a slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Instrucciones de teclado */}
            <div className="keyboard-hints">
              <small>
                ← → Navegar | Espacio: Siguiente | Esc: Salir | Home/End: Primera/Última
              </small>
            </div>
          </div>
        </div>
      )}
    </AuthWrapper>
  );
}