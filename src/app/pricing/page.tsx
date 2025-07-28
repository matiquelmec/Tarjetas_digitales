'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { PLAN_LIMITS } from '@/lib/stripe';

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!session) {
      alert('Please sign in to subscribe');
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error creating checkout session');
    } finally {
      setLoading(null);
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
        .pricing-card-featured {
          border: 2px solid #00F6FF !important;
          transform: scale(1.05);
        }
      `}</style>
      <div className="animated-gradient-background">
        <Container className="py-5">
          <Row className="mb-5">
            <Col>
              <h1 className="text-center text-white display-4 fw-bold mb-3">
                Choose Your Plan
              </h1>
              <p className="text-center text-white lead">
                Start free and upgrade as you grow. All plans include our core features.
              </p>
            </Col>
          </Row>

          <Row className="justify-content-center">
            {/* FREE Plan */}
            <Col lg={3} md={6} className="mb-4">
              <Card className="glass-card text-white h-100">
                <Card.Header className="text-center border-0 bg-transparent">
                  <h3>Free</h3>
                  <h2 className="display-4 fw-bold">$0</h2>
                  <p>per month</p>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush" className="bg-transparent">
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ {PLAN_LIMITS.FREE.maxCards} active card
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Basic templates
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Basic analytics
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Community support
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="border-0 bg-transparent">
                  <Button variant="outline-light" className="w-100" disabled>
                    Current Plan
                  </Button>
                </Card.Footer>
              </Card>
            </Col>

            {/* PROFESSIONAL Plan */}
            <Col lg={3} md={6} className="mb-4">
              <Card className="glass-card text-white h-100 pricing-card-featured">
                <Card.Header className="text-center border-0 bg-transparent">
                  <div className="badge bg-primary mb-2">Most Popular</div>
                  <h3>Professional</h3>
                  <h2 className="display-4 fw-bold">$12.99</h2>
                  <p>per month</p>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush" className="bg-transparent">
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ {PLAN_LIMITS.PROFESSIONAL.maxCards} active cards
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ All premium templates
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ No watermark
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Advanced analytics
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Custom domain
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Priority support
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="border-0 bg-transparent">
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={() => handleSubscribe('price_professional', 'Professional')}
                    disabled={loading === 'Professional'}
                  >
                    {loading === 'Professional' ? 'Loading...' : 'Subscribe Now'}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>

            {/* BUSINESS Plan */}
            <Col lg={3} md={6} className="mb-4">
              <Card className="glass-card text-white h-100">
                <Card.Header className="text-center border-0 bg-transparent">
                  <h3>Business</h3>
                  <h2 className="display-4 fw-bold">$39.99</h2>
                  <p>per month</p>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush" className="bg-transparent">
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ {PLAN_LIMITS.BUSINESS.maxCards} active cards
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Team collaboration (10 users)
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ API access
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ White-label options
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ CRM integrations
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Team analytics
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="border-0 bg-transparent">
                  <Button 
                    variant="outline-light" 
                    className="w-100"
                    onClick={() => handleSubscribe('price_business', 'Business')}
                    disabled={loading === 'Business'}
                  >
                    {loading === 'Business' ? 'Loading...' : 'Subscribe Now'}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>

            {/* ENTERPRISE Plan */}
            <Col lg={3} md={6} className="mb-4">
              <Card className="glass-card text-white h-100">
                <Card.Header className="text-center border-0 bg-transparent">
                  <h3>Enterprise</h3>
                  <h2 className="display-4 fw-bold">$199+</h2>
                  <p>per month</p>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush" className="bg-transparent">
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Unlimited cards
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Unlimited users
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Full white-label
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Custom development
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ SLA 99.9% uptime
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-white border-0">
                      ✓ Dedicated success manager
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="border-0 bg-transparent">
                  <Button variant="outline-light" className="w-100">
                    Contact Sales
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}