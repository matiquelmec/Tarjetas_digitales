'use client';

import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { useState } from 'react';

interface StepOneProps {
  cardData: any;
  updateCardData: (field: string, value: any) => void;
}

export function StepOne({ cardData, updateCardData }: StepOneProps) {
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [aboutSuggestions, setAboutSuggestions] = useState<string[]>([]);

  const generateTitleSuggestions = (text: string) => {
    const suggestions = [
      `${text} Certificado`,
      `${text} Senior`,
      `${text} Especialista`,
      `Expert ${text}`,
      `${text} Profesional`,
    ].filter(s => s !== text);
    setTitleSuggestions(suggestions.slice(0, 3));
  };

  const generateAboutSuggestions = (text: string) => {
    const suggestions = [
      `${text} Con más de 5 años de experiencia, me especializo en crear soluciones innovadoras y eficientes.`,
      `Profesional ${text.toLowerCase()} con enfoque en resultados y atención personalizada. Comprometido con la excelencia.`,
      `${text} Experto en mi área con metodologías modernas y enfoque centrado en el cliente.`,
    ];
    setAboutSuggestions(suggestions);
  };

  const applySuggestion = (suggestion: string, type: 'title' | 'about') => {
    if (type === 'title') {
      updateCardData('title', suggestion);
      setTitleSuggestions([]);
    } else {
      updateCardData('about', suggestion);
      setAboutSuggestions([]);
    }
  };

  return (
    <div>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Alejandro Torres"
              value={cardData.name}
              onChange={(e) => updateCardData('name', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Título Profesional *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Desarrollador Full-Stack"
              value={cardData.title}
              onChange={(e) => updateCardData('title', e.target.value)}
              required
            />
            <Button 
              variant="outline-info" 
              size="sm" 
              className="mt-2"
              onClick={() => generateTitleSuggestions(cardData.title)}
              disabled={!cardData.title}
            >
              🤖 Mejorar con IA
            </Button>
            
            {titleSuggestions.length > 0 && (
              <div className="mt-3 p-3 rounded bg-dark bg-opacity-25">
                <h6 className="text-info mb-2">Sugerencias de título:</h6>
                {titleSuggestions.map((suggestion, index) => (
                  <div key={index} className="d-grid gap-2 mb-2">
                    <Button 
                      variant="outline-light" 
                      size="sm"
                      onClick={() => applySuggestion(suggestion, 'title')}
                    >
                      {suggestion}
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => setTitleSuggestions([])}
                >
                  Cerrar sugerencias
                </Button>
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Empresa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Tech Solutions Inc."
              value={cardData.company}
              onChange={(e) => updateCardData('company', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              placeholder="alejandro@ejemplo.com"
              value={cardData.email}
              onChange={(e) => updateCardData('email', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <InputGroup>
              <InputGroup.Text>+56</InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="987654321"
                value={cardData.phone}
                onChange={(e) => updateCardData('phone', e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>WhatsApp</Form.Label>
            <InputGroup>
              <InputGroup.Text>+56</InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="987654321"
                value={cardData.whatsapp}
                onChange={(e) => updateCardData('whatsapp', e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* About Section */}
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Sobre mí / Descripción profesional</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Cuéntanos sobre tu experiencia, especialidades y lo que te hace único..."
              value={cardData.about}
              onChange={(e) => updateCardData('about', e.target.value)}
            />
            <Button 
              variant="outline-info" 
              size="sm" 
              className="mt-2"
              onClick={() => generateAboutSuggestions(cardData.title || 'Profesional')}
            >
              🤖 Generar descripción con IA
            </Button>
            
            {aboutSuggestions.length > 0 && (
              <div className="mt-3 p-3 rounded bg-dark bg-opacity-25">
                <h6 className="text-info mb-2">Sugerencias de descripción:</h6>
                {aboutSuggestions.map((suggestion, index) => (
                  <div key={index} className="mb-2">
                    <div className="bg-secondary bg-opacity-25 p-2 rounded mb-2">
                      <small>{suggestion}</small>
                    </div>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => applySuggestion(suggestion, 'about')}
                    >
                      Usar esta descripción
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => setAboutSuggestions([])}
                >
                  Cerrar sugerencias
                </Button>
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <div className="bg-info bg-opacity-10 p-3 rounded mt-4">
        <small className="text-info">
          <strong>🤖 IA Integrada:</strong> Usa nuestras sugerencias con IA para crear títulos y descripciones más impactantes. 
          Los campos marcados con * son obligatorios.
        </small>
      </div>
    </div>
  );
}