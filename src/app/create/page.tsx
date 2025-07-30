'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthWrapper } from '@/components/AuthWrapper';
import { StepOne } from '@/components/create/StepOne';
import { StepTwo } from '@/components/create/StepTwo';
import { StepThree } from '@/components/create/StepThree';
import { StepFour } from '@/components/create/StepFour';
import { PublishModal } from '@/components/create/PublishModal';
import dynamic from 'next/dynamic';

const BusinessCard = dynamic(() => import('@/features/digital-card/components/BusinessCard'), {
  loading: () => <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
    <div className="spinner-border text-light" role="status">
      <span className="visually-hidden">Cargando vista previa...</span>
    </div>
  </div>,
  ssr: false
});

export default function CreateCardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [planLimits, setPlanLimits] = useState<any>(null);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [cardData, setCardData] = useState({
    // Datos básicos - Prellenado con datos realistas
    name: 'Dr. María Elena Rodríguez',
    title: 'Especialista en Cardiología Clínica',
    about: 'Con más de 15 años de experiencia en cardiología clínica, me especializo en el diagnóstico y tratamiento de enfermedades cardiovasculares. Comprometida con brindar atención médica integral y de calidad a cada paciente.',
    company: 'Hospital Clínico Universidad de Chile',
    email: 'dra.rodriguez@clinica.cl',
    phone: '+56 9 8765 4321',
    location: 'Providencia, Santiago, Chile',
    whatsapp: '56987654321',
    
    // Diseño
    template: 'modern',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    cardBackgroundColor: '#2c2c2c',
    cardTextColor: '#ffffff',
    buttonSecondaryColor: '#00F6FF',
    buttonSecondaryHoverColor: '#00D1DB',
    buttonNormalBackgroundColor: '#1F1F1F',
    
    // Efectos visuales - Desactivados para usuarios FREE
    enableHoverEffect: false,
    enableGlassmorphism: false,
    enableSubtleAnimations: false,
    enableBackgroundPatterns: false,
    
    // Redes sociales - Con datos de ejemplo
    linkedin: 'https://linkedin.com/in/dra-maria-rodriguez',
    twitter: '',
    instagram: '@dra.mariaelena',
    website: 'https://drarodriguez.cl',
    facebook: '',
    appointmentLink: 'https://calendly.com/dra-rodriguez',
    
    // Detalles profesionales
    professionalDetails: 'Médico Cirujano, Universidad de Chile\nEspecialista en Cardiología, Hospital Johns Hopkins\nMiembro del Colegio Médico de Chile\nCertificación en Ecocardiografía Avanzada\n\nHorarios de Atención:\nLunes a Viernes: 9:00 - 18:00\nSábados: 9:00 - 13:00',
    
    // Configuración
    customUrl: '',
    isPublic: true,
  });

  useEffect(() => {
    if (session?.user?.id) {
      checkPlanLimits();
    }
  }, [session]);

  const checkPlanLimits = async () => {
    try {
      const response = await fetch('/api/user/plan-limits');
      if (response.ok) {
        const limits = await response.json();
        setPlanLimits(limits);
        
        // Check if user can create more cards
        const cardsResponse = await fetch('/api/cards');
        if (cardsResponse.ok) {
          const cards = await cardsResponse.json();
          if (limits.maxCards !== -1 && cards.length >= limits.maxCards) {
            setLimitError(`Has alcanzado el límite de tu plan de ${limits.maxCards} tarjeta${limits.maxCards > 1 ? 's' : ''}. Por favor actualiza tu plan para crear más tarjetas.`);
          } else {
            setLimitError(null); // Clear any previous errors
          }
        }
      }
    } catch (error) {
      console.error('Error checking plan limits:', error);
      setLimitError('Error verificando límites del plan. Por favor intenta de nuevo.');
    }
  };

  const steps = [
    { id: 1, title: 'Datos Básicos', description: 'Información personal y contacto' },
    { id: 2, title: 'Diseño', description: 'Personaliza tu tarjeta' },
    { id: 3, title: 'Redes Sociales', description: 'Conecta tus perfiles' },
    { id: 4, title: 'Review & Publish', description: 'Revisa y publica' },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPublishModal(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCardData = (field: string, value: any) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne cardData={cardData} updateCardData={updateCardData} />;
      case 2:
        return <StepTwo cardData={cardData} updateCardData={updateCardData} />;
      case 3:
        return <StepThree cardData={cardData} updateCardData={updateCardData} />;
      case 4:
        return <StepFour cardData={cardData} updateCardData={updateCardData} />;
      default:
        return null;
    }
  };

  return (
    <AuthWrapper>
      <style jsx global>{`
        .animated-gradient-background {
          background: linear-gradient(-45deg, #00c6ff, #0072ff, #8e2de2, #4a00e0);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          min-height: 100vh;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .step-indicator {
          position: relative;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .step-indicator.active {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid #00F6FF;
        }
        .step-indicator.completed {
          background: rgba(0, 246, 255, 0.2);
        }
      `}</style>
      
      <div className="animated-gradient-background">
        <Container className="py-4">
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-sm-center gap-3">
                <h1 className="text-white h2 h-sm-1 mb-0">Crear Nueva Tarjeta Digital</h1>
                <Button variant="outline-light" href="/dashboard" size="sm" className="align-self-start">
                  ← Volver
                </Button>
              </div>
            </Col>
          </Row>

          {/* Plan Limit Warning */}
          {limitError && (
            <Row className="mb-4">
              <Col>
                <Alert variant="warning" className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Plan Limit Reached!</strong> {limitError}
                  </div>
                  <Button variant="outline-primary" size="sm" href="/pricing">
                    Upgrade Now
                  </Button>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Progress Bar */}
          <Row className="mb-4">
            <Col>
              <Card className="glass-card text-white">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Progreso: {steps[currentStep - 1].title}</h5>
                    <small className="text-light">Paso {currentStep} de 4</small>
                  </div>
                  <ProgressBar 
                    now={(currentStep / 4) * 100} 
                    variant="info"
                    style={{ height: '8px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Formulario - 50% */}
            <Col lg={6}>
              <Card className="glass-card text-white" style={{ height: 'fit-content' }}>
                <Card.Header>
                  <h4 className="mb-0">{steps[currentStep - 1].title}</h4>
                </Card.Header>
                <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                  {renderStep()}
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                  <Button 
                    variant="outline-light" 
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                  >
                    ← Anterior
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleNext}
                    disabled={!!(limitError && currentStep === 4)}
                  >
                    {limitError && currentStep === 4 ? 'Upgrade Required' : (currentStep === 4 ? 'Publicar Tarjeta' : 'Siguiente →')}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>

            {/* Preview - 50% con tamaño real */}
            <Col lg={6}>
              <div style={{ position: 'sticky', top: '20px' }}>
                <Card className="glass-card text-white">
                  <Card.Header className="text-center">
                    <h6 className="mb-0">👁️ Vista Previa - Tamaño Real</h6>
                    <small className="text-light">480px × Auto</small>
                  </Card.Header>
                  <Card.Body className="p-3" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                    <div style={{ 
                      width: '100%',
                      maxWidth: '480px', 
                      margin: '0 auto'
                    }}>
                      <BusinessCard
                        name={cardData.name || 'Tu Nombre'}
                        title={cardData.title || 'Tu Título'}
                        about={cardData.about || 'Tu descripción profesional aparecerá aquí...'}
                        location={cardData.location || 'Tu ubicación'}
                        whatsapp={cardData.whatsapp || '56912345678'}
                        email={cardData.email || 'tu@email.com'}
                        photoUrl={cardData.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'}
                        cardBackgroundColor={cardData.cardBackgroundColor}
                        cardTextColor={cardData.cardTextColor}
                        enableHoverEffect={cardData.enableHoverEffect}
                        enableGlassmorphism={cardData.enableGlassmorphism}
                        enableSubtleAnimations={cardData.enableSubtleAnimations}
                        enableBackgroundPatterns={cardData.enableBackgroundPatterns}
                        whatsappShareUrl=""
                        appointmentLink={cardData.appointmentLink}
                        professionalDetails={cardData.professionalDetails}
                        linkedin={cardData.linkedin}
                        instagram={cardData.instagram}
                        twitter={cardData.twitter}
                        facebook={cardData.facebook}
                        buttonSecondaryColor={cardData.buttonSecondaryColor}
                        buttonNormalBackgroundColor={cardData.buttonNormalBackgroundColor}
                        buttonSecondaryHoverColor={cardData.buttonSecondaryHoverColor}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <PublishModal 
        show={showPublishModal}
        onHide={() => setShowPublishModal(false)}
        cardData={cardData}
      />
    </AuthWrapper>
  );
}