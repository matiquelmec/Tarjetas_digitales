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
        
        .alien-nav-tab {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 246, 255, 0.3);
          color: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          margin: 0 4px;
          transition: all 0.3s ease;
        }
        
        .alien-nav-tab:hover {
          background: rgba(0, 246, 255, 0.1);
          color: #00f6ff;
          transform: translateY(-2px);
        }
        
        .alien-nav-tab.active {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 20px rgba(0, 246, 255, 0.4);
        }
        
        .alien-btn {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          padding: 8px 20px;
          border-radius: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          color: white;
        }
        
        .alien-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 246, 255, 0.4);
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          color: white;
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
      `}</style>
      
      {/* Navbar con Indi */}
      <IndiNavbar variant="transparent" position="relative" showActions={true} />
      
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="title-glow text-center mb-1" style={{ fontSize: '2.5rem' }}>
              📊 Presentaciones Inmersivas
            </h1>
            <p className="text-center text-white-50 mb-0">
              Crea presentaciones que hipnoticen a tu audiencia con tecnología intergaláctica
            </p>
          </Col>
        </Row>

        <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || 'create')}>
          <Row className="mb-4">
            <Col>
              <Nav variant="pills" className="justify-content-center">
                <Nav.Item>
                  <Nav.Link eventKey="create" className="alien-nav-tab">
                    <span className="me-2">✨</span>
                    Crear Presentación
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="themes" className="alien-nav-tab">
                    <span className="me-2">🎨</span>
                    Temas y Diseño
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ai-assistant" className="alien-nav-tab">
                    <span className="me-2">🤖</span>
                    Asistente IA
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>

          <Tab.Content>
            {/* Tab 1: Crear Presentación */}
            <Tab.Pane eventKey="create">
              <Row>
                <Col lg={3}>
                  <Card className="glass-card h-100 text-white">
                    <Card.Header className="border-0">
                      <h5 className="mb-0">🎭 Diapositivas</h5>
                    </Card.Header>
                    <Card.Body className="slides-container">
                      {currentSlides.map((slide, index) => (
                        <div 
                          key={slide.id} 
                          className="slide-thumbnail"
                        >
                          <div className="text-center">
                            <div className="mb-2">
                              {slide.type === 'title' && '📋'}
                              {slide.type === 'content' && '📄'}
                              {slide.type === 'image' && '🖼️'}
                              {slide.type === 'chart' && '📊'}
                            </div>
                            <div>
                              Slide {index + 1}
                              <br />
                              <small className="text-muted">
                                {slide.type === 'title' ? 'Título' : 
                                 slide.type === 'content' ? 'Contenido' : 
                                 slide.type === 'image' ? 'Imagen' : 'Gráfico'}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center mt-3">
                        <Button 
                          className="alien-btn mb-2" 
                          size="sm" 
                          style={{ width: '100%' }}
                          onClick={() => addSlide('content')}
                        >
                          <span className="me-2">➕</span>
                          Agregar Slide
                        </Button>
                        <Button 
                          className="alien-btn" 
                          size="sm" 
                          style={{ width: '100%', background: 'linear-gradient(135deg, #8e2de2, #4a00e0)' }}
                          onClick={() => addSlide('image')}
                        >
                          <span className="me-2">🖼️</span>
                          Slide con Imagen
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col lg={9}>
                  <Card className="glass-card text-white">
                    <Card.Header className="border-0 d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">🔮 Vista Previa</h5>
                      <div>
                        <Button 
                          className="alien-btn me-2" 
                          size="sm"
                          onClick={handleSavePresentation}
                          disabled={isLoading}
                        >
                          <span className="me-2">💾</span>
                          {isLoading ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button 
                          className="alien-btn me-2" 
                          size="sm"
                          disabled={!currentPresentation}
                          onClick={handleExportPDF}
                          title={!currentPresentation ? 'Genera o carga una presentación primero' : 'Exportar a PDF'}
                        >
                          <span className="me-2">📄</span>
                          Exportar PDF
                        </Button>
                        <Button 
                          className="alien-btn" 
                          size="sm"
                          disabled={!currentPresentation}
                          title={!currentPresentation ? 'Genera o carga una presentación primero' : 'Modo presentación'}
                        >
                          <span className="me-2">▶️</span>
                          Presentar
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body style={{ minHeight: '600px' }}>
                      <div className="h-100 d-flex align-items-center justify-content-center">
                        <SlidePreview
                          slide={currentSlides[0]}
                          theme={selectedTheme}
                          isPreview={true}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
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
    </AuthWrapper>
  );
}