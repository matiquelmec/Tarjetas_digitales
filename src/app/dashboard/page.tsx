'use client';

import { useMockSession } from '@/lib/mock-session';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import Link from 'next/link';
import { AuthWrapper } from '../../components/AuthWrapper';

interface CardData {
  id: string;
  title: string;
  name: string;
  profession: string;
  views: number;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session } = useMockSession();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards');
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCards(cards.filter(card => card.id !== cardId));
      }
    } catch (error) {
      console.error('Error deleting card:', error);
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
      `}</style>
      <div className="animated-gradient-background">
        <Container className="py-5">
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="text-white">Dashboard</h1>
                <div>
                  <span className="text-white me-3">Welcome, {session?.user?.name}</span>
                  <Button variant="outline-light" onClick={() => alert('Sign out disabled in demo')}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={3}>
              <Card className="glass-card text-white text-center">
                <Card.Body>
                  <h3>{cards.length}</h3>
                  <p>Total Cards</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="glass-card text-white text-center">
                <Card.Body>
                  <h3>{cards.reduce((sum, card) => sum + card.views, 0)}</h3>
                  <p>Total Views</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="glass-card text-white text-center">
                <Card.Body>
                  <h3>{cards.reduce((sum, card) => sum + card.clicks, 0)}</h3>
                  <p>Total Clicks</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="glass-card text-white text-center">
                <Card.Body>
                  <h3>{cards.filter(card => card.isActive).length}</h3>
                  <p>Active Cards</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="glass-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h3 className="text-white mb-0">Your Business Cards</h3>
                  <Link href="/business-card-generator">
                    <Button variant="primary">Create New Card</Button>
                  </Link>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-white text-center">Loading...</div>
                  ) : cards.length === 0 ? (
                    <div className="text-white text-center py-4">
                      <p>You haven't created any cards yet.</p>
                      <Link href="/business-card-generator">
                        <Button variant="primary">Create Your First Card</Button>
                      </Link>
                    </div>
                  ) : (
                    <Table className="text-white">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Title</th>
                          <th>Views</th>
                          <th>Clicks</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cards.map((card) => (
                          <tr key={card.id}>
                            <td>{card.name}</td>
                            <td>{card.profession}</td>
                            <td>{card.views}</td>
                            <td>{card.clicks}</td>
                            <td>
                              <span className={`badge ${card.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                {card.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>{new Date(card.createdAt).toLocaleDateString()}</td>
                            <td>
                              <Link href={`/card/${card.id}`} target="_blank">
                                <Button variant="outline-light" size="sm" className="me-2">
                                  View
                                </Button>
                              </Link>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => deleteCard(card.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </AuthWrapper>
  );
}