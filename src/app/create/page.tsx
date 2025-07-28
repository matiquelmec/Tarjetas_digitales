'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useMockSession } from '@/lib/mock-session';
import { StepOne } from '@/components/create/StepOne';
import { StepTwo } from '@/components/create/StepTwo';
import { StepThree } from '@/components/create/StepThree';
import { StepFour } from '@/components/create/StepFour';
import { PublishModal } from '@/components/create/PublishModal';

export default function CreateCardPage() {
  const { data: session } = useMockSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [cardData, setCardData] = useState({
    // Datos básicos
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    
    // Diseño
    template: 'modern',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    photo: '',
    
    // Redes sociales
    linkedin: '',
    twitter: '',
    instagram: '',
    website: '',
    whatsapp: '',
    
    // Configuración
    customUrl: '',
    isPublic: true,
  });

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
    <>
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
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="text-white">Crear Nueva Tarjeta Digital</h1>
                <Button variant="outline-light" href="/dashboard">
                  ← Volver al Dashboard
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            {/* Steps Sidebar */}
            <Col lg={3} className="mb-4">
              <Card className="glass-card text-white">
                <Card.Header>
                  <h5 className="mb-0">Progreso</h5>
                  <ProgressBar 
                    now={(currentStep / 4) * 100} 
                    className="mt-2"
                    variant="info"
                  />
                </Card.Header>
                <Card.Body>
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`step-indicator ${
                        step.id === currentStep ? 'active' : 
                        step.id < currentStep ? 'completed' : ''
                      }`}
                      onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                    >
                      <div className="d-flex align-items-center">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                          step.id <= currentStep ? 'bg-info' : 'bg-secondary'
                        }`} style={{ width: '30px', height: '30px' }}>
                          {step.id < currentStep ? '✓' : step.id}
                        </div>
                        <div>
                          <div className="fw-bold">{step.title}</div>
                          <small className="text-light">{step.description}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* Main Content */}
            <Col lg={9}>
              <Card className="glass-card text-white">
                <Card.Header>
                  <h4 className="mb-0">{steps[currentStep - 1].title}</h4>
                </Card.Header>
                <Card.Body>
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
                  >
                    {currentStep === 4 ? 'Publicar Tarjeta' : 'Siguiente →'}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <PublishModal 
        show={showPublishModal}
        onHide={() => setShowPublishModal(false)}
        cardData={cardData}
      />
    </>
  );
}