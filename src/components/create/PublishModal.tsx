'use client';

import { Modal, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PublishModalProps {
  show: boolean;
  onHide: () => void;
  cardData: any;
}

export function PublishModal({ show, onHide, cardData }: PublishModalProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(1); // 1: Publishing, 2: Success
  const [cardUrl, setCardUrl] = useState('');

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalUrl = `https://tarjetasdigitales.netlify.app/c/${cardData.customUrl}`;
      setCardUrl(finalUrl);
      setPublishStep(2);
    } catch (error) {
      console.error('Error publishing card:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cardData.name}-qr-code.png`;
      a.click();
    }
  };

  const shareWhatsApp = () => {
    const message = `¡Hola! Te comparto mi tarjeta digital: ${cardUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareEmail = () => {
    const subject = `Tarjeta Digital de ${cardData.name}`;
    const body = `Hola,\n\nTe comparto mi tarjeta digital profesional:\n${cardUrl}\n\nSaludos,\n${cardData.name}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          {publishStep === 1 ? '🚀 Publicando tu Tarjeta' : '🎉 ¡Tarjeta Publicada!'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        {publishStep === 1 ? (
          // Publishing Step
          <div className="text-center">
            {isPublishing ? (
              <>
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Publicando...</span>
                </div>
                <h5>Creando tu tarjeta digital...</h5>
                <p className="text-muted">Esto tomará solo unos segundos</p>
              </>
            ) : (
              <>
                <h5>¿Listo para publicar tu tarjeta?</h5>
                <p className="text-muted mb-4">
                  Tu tarjeta estará disponible inmediatamente en internet
                </p>
                
                <Alert variant="info">
                  <strong>URL:</strong> https://tarjetasdigitales.netlify.app/c/{cardData.customUrl}
                </Alert>
                
                <div className="d-flex gap-2 justify-content-center">
                  <Button variant="outline-light" onClick={onHide}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handlePublish}>
                    Publicar Ahora
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          // Success Step
          <div>
            <div className="text-center mb-4">
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <span style={{ fontSize: '2rem' }}>✅</span>
              </div>
              <h4>¡Tu tarjeta está lista!</h4>
              <p className="text-muted">Ya puedes compartirla con el mundo</p>
            </div>

            {/* URL Section */}
            <div className="mb-4">
              <Form.Label>URL de tu tarjeta</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={cardUrl}
                  readOnly
                  className="bg-dark text-white border-secondary"
                />
                <Button 
                  variant="outline-info" 
                  onClick={() => copyToClipboard(cardUrl)}
                >
                  📋 Copiar
                </Button>
              </InputGroup>
            </div>

            {/* QR Code */}
            <div className="text-center mb-4">
              <h6>Código QR</h6>
              <div className="bg-white p-3 rounded d-inline-block">
                <QRCodeSVG 
                  id="qr-code"
                  value={cardUrl} 
                  size={150}
                  level="M"
                />
              </div>
              <br />
              <Button variant="outline-light" size="sm" className="mt-2" onClick={downloadQR}>
                📥 Descargar QR
              </Button>
            </div>

            {/* Sharing Options */}
            <div className="mb-4">
              <h6>Compartir tu tarjeta</h6>
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="success" size="sm" onClick={shareWhatsApp}>
                  📱 WhatsApp
                </Button>
                <Button variant="info" size="sm" onClick={shareEmail}>
                  📧 Email
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => window.open(cardUrl, '_blank')}
                >
                  👁️ Ver Tarjeta
                </Button>
              </div>
            </div>

            {/* Next Steps */}
            <Alert variant="warning">
              <h6>🚀 Próximos pasos recomendados:</h6>
              <ul className="mb-0">
                <li>Agrega el QR a tu firma de email</li>
                <li>Comparte en tus redes sociales</li>
                <li>Imprime el QR en tarjetas físicas</li>
                <li>Considera upgradearte para dominio personalizado</li>
              </ul>
            </Alert>
          </div>
        )}
      </Modal.Body>
      
      {publishStep === 2 && (
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="outline-light" onClick={onHide}>
            Cerrar
          </Button>
          <Button variant="primary" href="/dashboard">
            Ir al Dashboard
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}