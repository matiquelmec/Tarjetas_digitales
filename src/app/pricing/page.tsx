'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import IndiNavbar from '@/components/layout/IndiNavbar';

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCardPayment = async () => {
    if (!session) {
      signIn();
      return;
    }

    setLoading('card');

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: 'card',
          amount: 4990,
          successUrl: `${window.location.origin}/dashboard?success=true&type=card`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === 'MercadoPago not configured') {
        alert('Sistema de pagos no configurado aún. Por favor contacta a soporte.');
      } else {
        alert('Error creando sesión de pago: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error creando sesión de pago');
    } finally {
      setLoading(null);
    }
  };

  const handleProPayment = async () => {
    if (!session) {
      signIn();
      return;
    }

    setLoading('pro');

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: 'pro',
          amount: 12990,
          successUrl: `${window.location.origin}/dashboard?success=true&type=pro`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === 'MercadoPago not configured') {
        alert('Sistema de pagos no configurado aún. Por favor contacta a soporte.');
      } else {
        alert('Error creando sesión de pago: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error creando sesión de pago');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <style jsx global>{`
        .animated-gradient-background {
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
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
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
        }
        .pricing-card-featured {
          border: 3px solid #00F6FF !important;
          transform: scale(1.05);
          position: relative;
        }
        .pricing-card-popular::before {
          content: "🔥 MÁS POPULAR";
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #00F6FF, #0072ff);
          color: white;
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 246, 255, 0.3);
        }
        .price-highlight {
          background: linear-gradient(135deg, #00F6FF, #0072ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .feature-included {
          color: #10b981;
        }
        .feature-not-included {
          color: #6b7280;
          opacity: 0.5;
        }
        .btn-pay-per-card {
          background: linear-gradient(135deg, #00F6FF, #0072ff) !important;
          border: none !important;
          color: white !important;
          font-weight: 700 !important;
          padding: 12px 30px !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0, 246, 255, 0.3) !important;
          transition: all 0.3s ease !important;
        }
        .btn-pay-per-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 32px rgba(0, 246, 255, 0.4) !important;
        }
        .btn-pro-plan {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
          border: none !important;
          color: white !important;
          font-weight: 700 !important;
          padding: 12px 30px !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3) !important;
          transition: all 0.3s ease !important;
        }
        .btn-pro-plan:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4) !important;
        }
        .btn-business-plan {
          background: linear-gradient(135deg, #D4A017, #B8860B) !important;
          border: none !important;
          color: white !important;
          font-weight: 700 !important;
          padding: 12px 30px !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(212, 160, 23, 0.3) !important;
          transition: all 0.3s ease !important;
        }
        .btn-business-plan:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 32px rgba(212, 160, 23, 0.4) !important;
        }
        .savings-label {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
          margin-top: 8px;
        }
      `}</style>
      <div className="animated-gradient-background">
        {/* Navbar con Indi */}
        <IndiNavbar variant="transparent" position="fixed" showActions={true} />
        
        <Container className="py-4" style={{ paddingTop: '120px' }}>
          {/* Header */}
          <Row className="mb-5">
            <Col>
              <div className="text-center">
                <Link href="/" className="text-white text-decoration-none mb-3 d-inline-block">
                  ← Volver al inicio
                </Link>
                <h1 className="text-white display-4 fw-bold mb-3">
                  Precios Simples y Transparentes
                </h1>
                <p className="text-white lead opacity-90">
                  Sin compromisos mensuales. Paga solo por lo que necesitas.
                </p>
              </div>
            </Col>
          </Row>

          {/* Pricing Cards */}
          <Row className="justify-content-center g-4">
            {/* Tarjeta Individual - Pay per Card */}
            <Col lg={4} md={6}>
              <Card className="glass-card text-white h-100 pricing-card-featured pricing-card-popular">
                <Card.Header className="text-center border-0 bg-transparent pt-4 pb-3">
                  <div className="mb-3">
                    <span style={{ fontSize: '3rem' }}>💎</span>
                  </div>
                  <h3 className="fw-bold mb-2">Tarjeta Individual</h3>
                  <div className="mb-2">
                    <span className="display-4 fw-bold price-highlight">$4.990</span>
                    <span className="text-white opacity-75"> CLP</span>
                  </div>
                  <p className="text-white opacity-75 mb-0">Pago único por tarjeta</p>
                  <div className="savings-label">
                    ✨ Sin compromisos mensuales
                  </div>
                </Card.Header>
                <Card.Body className="px-4">
                  <ListGroup variant="flush" className="bg-transparent">
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> 1 tarjeta digital premium
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Editor visual completo
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Efectos glassmorphism
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> QR code integrado
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Analytics básicos
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> URL personalizada
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Sin marca de agua
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Válida por 12 meses
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-not-included">✗</span> Analytics avanzados
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-not-included">✗</span> Integraciones CRM
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="border-0 bg-transparent p-4">
                  <Button 
                    className="btn-pay-per-card w-100 mb-3"
                    onClick={handleCardPayment}
                    disabled={loading === 'card'}
                  >
                    {loading === 'card' ? 'Procesando...' : '💎 Activar Mi Tarjeta'}
                  </Button>
                  <div className="text-center">
                    <small className="text-white opacity-75">
                      Pago único. Sin renovación automática.
                    </small>
                  </div>
                </Card.Footer>
              </Card>
            </Col>

            {/* Plan PRO - Para múltiples tarjetas */}
            <Col lg={4} md={6}>
              <Card className="glass-card text-white h-100">
                <Card.Header className="text-center border-0 bg-transparent pt-4 pb-3">
                  <div className="mb-3">
                    <span style={{ fontSize: '3rem' }}>🚀</span>
                  </div>
                  <h3 className="fw-bold mb-2">Plan PRO</h3>
                  <div className="mb-2">
                    <span className="display-4 fw-bold" style={{ color: '#8b5cf6' }}>$12.990</span>
                    <span className="text-white opacity-75"> CLP</span>
                  </div>
                  <p className="text-white opacity-75 mb-0">por mes</p>
                  <div className="savings-label">
                    💰 Ahorra 40% vs tarjetas individuales
                  </div>
                </Card.Header>
                <Card.Body className="px-4">
                  <ListGroup variant="flush" className="bg-transparent">
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>3 tarjetas incluidas</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Tarjetas adicionales: $2.990 c/u
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Todo lo del plan individual
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>Analytics avanzados</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>Templates exclusivos</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>Integraciones CRM</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>Soporte prioritario</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Dashboard avanzado
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Exportar datos
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-not-included">✗</span> Team management
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="border-0 bg-transparent p-4">
                  <Button 
                    className="btn-pro-plan w-100 mb-3"
                    onClick={handleProPayment}
                    disabled={loading === 'pro'}
                  >
                    {loading === 'pro' ? 'Procesando...' : '🚀 Comenzar Plan PRO'}
                  </Button>
                  <div className="text-center">
                    <small className="text-white opacity-75">
                      Facturación mensual. Cancela cuando quieras.
                    </small>
                  </div>
                </Card.Footer>
              </Card>
            </Col>

            {/* Plan Business */}
            <Col lg={4} md={6}>
              <Card className="glass-card text-white h-100">
                <Card.Header className="text-center border-0 bg-transparent pt-4 pb-3">
                  <div className="mb-3">
                    <span style={{ fontSize: '3rem' }}>🏢</span>
                  </div>
                  <h3 className="fw-bold mb-2">Plan Business</h3>
                  <div className="mb-2">
                    <span className="display-4 fw-bold" style={{ color: '#D4A017' }}>$29.990</span>
                    <span className="text-white opacity-75"> CLP</span>
                  </div>
                  <p className="text-white opacity-75 mb-0">por mes</p>
                  <div className="savings-label">
                    🎯 Perfecto para equipos
                  </div>
                </Card.Header>
                <Card.Body className="px-4">
                  <ListGroup variant="flush" className="bg-transparent">
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>10 tarjetas incluidas</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Tarjetas ilimitadas adicionales
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Todo lo del Plan PRO
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>Team management</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>White-label opcional</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>API access</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> <strong>Custom domain</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Manager dashboard
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Soporte dedicado
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0">
                      <span className="feature-included">✓</span> Capacitación incluida
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="border-0 bg-transparent p-4">
                  <Button 
                    className="btn-business-plan w-100 mb-3"
                    href="mailto:contacto@tarjetasdigitales.cl?subject=Consulta Plan Business"
                  >
                    🏢 Contactar Ventas
                  </Button>
                  <div className="text-center">
                    <small className="text-white opacity-75">
                      Consultora personalizada incluida.
                    </small>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>

          {/* Value Proposition */}
          <Row className="mt-5">
            <Col>
              <div className="text-center">
                <h3 className="text-white mb-4">¿Por qué elegir nuestro modelo?</h3>
                <Row className="g-4">
                  <Col md={4}>
                    <div className="glass-card p-4 h-100">
                      <div className="mb-3">
                        <span style={{ fontSize: '2.5rem' }}>💰</span>
                      </div>
                      <h5 className="text-white fw-bold">Sin Compromisos</h5>
                      <p className="text-white opacity-75">
                        Paga solo por lo que necesitas. Sin suscripciones forzadas ni renovaciones automáticas.
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="glass-card p-4 h-100">
                      <div className="mb-3">
                        <span style={{ fontSize: '2.5rem' }}>⚡</span>
                      </div>
                      <h5 className="text-white fw-bold">Activación Inmediata</h5>
                      <p className="text-white opacity-75">
                        Crea tu tarjeta gratis, ve el resultado y actívala solo si te encanta.
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="glass-card p-4 h-100">
                      <div className="mb-3">
                        <span style={{ fontSize: '2.5rem' }}>🎯</span>
                      </div>
                      <h5 className="text-white fw-bold">Transparencia Total</h5>
                      <p className="text-white opacity-75">
                        Precios claros, sin costos ocultos. Lo que ves es lo que pagas.
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* FAQ */}
          <Row className="mt-5">
            <Col lg={8} className="mx-auto">
              <div className="glass-card p-4">
                <h4 className="text-white text-center mb-4">Preguntas Frecuentes</h4>
                <div className="text-white">
                  <div className="mb-3">
                    <strong>¿Qué pasa después de 12 meses?</strong>
                    <p className="opacity-75 mb-0">Tu tarjeta seguirá funcionando. Para renovar con nuevas funciones, el costo es solo $2.990.</p>
                  </div>
                  <div className="mb-3">
                    <strong>¿Puedo cambiar el diseño después de pagar?</strong>
                    <p className="opacity-75 mb-0">¡Sí! Puedes editar tu tarjeta las veces que quieras sin costo adicional.</p>
                  </div>
                  <div className="mb-3">
                    <strong>¿El Plan PRO se renueva automáticamente?</strong>
                    <p className="opacity-75 mb-0">Sí, pero puedes cancelar en cualquier momento desde tu dashboard.</p>
                  </div>
                  <div>
                    <strong>¿Ofrecen garantía?</strong>
                    <p className="opacity-75 mb-0">Sí, 30 días de garantía completa. Si no estás satisfecho, te devolvemos tu dinero.</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}