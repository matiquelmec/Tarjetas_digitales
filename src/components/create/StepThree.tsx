'use client';

import { Form, Row, Col, InputGroup } from 'react-bootstrap';

interface StepThreeProps {
  cardData: any;
  updateCardData: (field: string, value: any) => void;
}

export function StepThree({ cardData, updateCardData }: StepThreeProps) {
  const socialPlatforms = [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: '💼',
      placeholder: 'alejandro-torres',
      prefix: 'linkedin.com/in/'
    },
    {
      key: 'twitter',
      label: 'Twitter/X',
      icon: '🐦',
      placeholder: 'alejandrodev',
      prefix: 'twitter.com/'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: '📸',
      placeholder: 'alejandro.dev',
      prefix: 'instagram.com/'
    },
    {
      key: 'website',
      label: 'Sitio Web',
      icon: '🌐',
      placeholder: 'https://alejandrotorres.dev',
      prefix: ''
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h5 className="mb-3">Conecta tus Redes Sociales</h5>
        <p className="text-muted">
          Agrega tus perfiles profesionales para que tus contactos puedan conectar contigo
        </p>
      </div>

      <Row>
        {socialPlatforms.map((platform) => (
          <Col md={6} key={platform.key} className="mb-3">
            <Form.Group>
              <Form.Label>
                {platform.icon} {platform.label}
              </Form.Label>
              {platform.prefix ? (
                <InputGroup>
                  <InputGroup.Text>{platform.prefix}</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={platform.placeholder}
                    value={cardData[platform.key]}
                    onChange={(e) => updateCardData(platform.key, e.target.value)}
                  />
                </InputGroup>
              ) : (
                <Form.Control
                  type="url"
                  placeholder={platform.placeholder}
                  value={cardData[platform.key]}
                  onChange={(e) => updateCardData(platform.key, e.target.value)}
                />
              )}
            </Form.Group>
          </Col>
        ))}
      </Row>

      {/* Preview Section */}
      <div className="mt-4 p-3 bg-dark bg-opacity-25 rounded">
        <h6 className="mb-3">Vista Previa de Enlaces</h6>
        <div className="d-flex flex-wrap gap-2">
          {socialPlatforms.map((platform) => {
            const value = cardData[platform.key];
            if (!value) return null;
            
            const url = platform.prefix 
              ? `https://${platform.prefix}${value}`
              : value;
              
            return (
              <a
                key={platform.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-info btn-sm"
              >
                {platform.icon} {platform.label}
              </a>
            );
          })}
          {Object.values(cardData).filter(Boolean).length === 0 && (
            <small className="text-muted">
              Los enlaces aparecerán aquí cuando los agregues
            </small>
          )}
        </div>
      </div>

      <div className="bg-success bg-opacity-10 p-3 rounded mt-4">
        <small className="text-success">
          <strong>🔗 Consejo:</strong> Asegúrate de que tus perfiles estén actualizados y sean profesionales. 
          Cada enlace es una oportunidad de generar una conexión valiosa.
        </small>
      </div>
    </div>
  );
}