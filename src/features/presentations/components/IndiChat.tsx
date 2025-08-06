'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
// import { FaPaperPlane, FaMicrophone, FaStop } from 'react-icons/fa';

interface Message {
  id: string;
  role: 'user' | 'indi';
  content: string;
  timestamp: Date;
}

interface IndiChatProps {
  onPresentationGenerated?: (presentationId: string) => void;
  className?: string;
}

const IndiChat: React.FC<IndiChatProps> = ({ onPresentationGenerated, className = '' }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with greeting message
  useEffect(() => {
    const greetingMessage: Message = {
      id: `msg_${Date.now()}_greeting`,
      role: 'indi',
      content: '¡Hola terrícola! 🛸 Soy Indi, tu embajador intergaláctico. ¿Sobre qué tema quieres crear una presentación hipnotizante?',
      timestamp: new Date()
    };
    setMessages([greetingMessage]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate Indi's response
    setTimeout(() => {
      const indiResponse: Message = {
        id: `msg_${Date.now()}_indi`,
        role: 'indi',
        content: `Interesante tema sobre "${userMessage.content}". Estoy procesando datos intergalácticos para crear una presentación espectacular. ¿Hay algún aspecto específico que te gustaría que enfatice?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, indiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleStartNewConversation = () => {
    setMessages([{
      id: `msg_${Date.now()}_greeting`,
      role: 'indi',
      content: '¡Hola de nuevo! 🛸 ¿Sobre qué tema quieres crear tu próxima presentación hipnotizante?',
      timestamp: new Date()
    }]);
  };

  const handleGeneratePresentation = async () => {
    if (onPresentationGenerated) {
      const mockPresentationId = `presentation_${Date.now()}`;
      onPresentationGenerated(mockPresentationId);
    }
  };

  return (
    <div className={`indi-chat ${className}`} style={{ maxWidth: '100%', height: '500px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Chat Header */}
      <div className="chat-header p-3 bg-primary text-white rounded-top d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div style={{ fontSize: '1.5rem' }}>🛸</div>
          <div>
            <div className="fw-bold">Indi AI</div>
            <div className="small opacity-75">
              {isLoading ? 'Pensando...' : 'Embajador Intergaláctico'}
            </div>
          </div>
        </div>
        <Button 
          variant="outline-light" 
          size="sm"
          onClick={handleStartNewConversation}
          disabled={isLoading}
        >
          Nueva Conversación
        </Button>
      </div>

      {/* Messages Area */}
      <div 
        className="messages-area flex-grow-1 p-3 bg-light"
        style={{ 
          overflowY: 'auto',
          maxHeight: '350px',
          minHeight: '300px'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message mb-3 d-flex ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`message-bubble p-2 px-3 rounded-3 max-w-75 ${
                message.role === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-white border'
              }`}
              style={{
                maxWidth: '75%',
                wordWrap: 'break-word'
              }}
            >
              {message.role === 'indi' && (
                <div className="small text-muted mb-1">
                  🛸 Indi
                </div>
              )}
              <div>{message.content}</div>
              <div className={`small mt-1 ${message.role === 'user' ? 'text-white-50' : 'text-muted'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message mb-3 d-flex justify-content-start">
            <div className="message-bubble p-2 px-3 rounded-3 bg-white border">
              <div className="small text-muted mb-1">🛸 Indi</div>
              <div className="d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <span>Analizando datos intergalácticos...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area p-3 bg-white border-top">
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <Form.Control
              ref={inputRef}
              type="text"
              placeholder="Pregúntame sobre tu presentación..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              disabled={isLoading}
              style={{ borderColor: isInputFocused ? '#0d6efd' : '#dee2e6' }}
            />
            <Button 
              variant="primary" 
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Enviando...</span>
                </div>
              ) : (
                '📤'
              )}
            </Button>
          </InputGroup>
        </Form>
        
        {/* Action Buttons */}
        <div className="d-flex gap-2 mt-2">
          <Button 
            variant="success" 
            size="sm"
            onClick={handleGeneratePresentation}
            disabled={messages.length < 3} // Enable after some conversation
          >
            ✨ Generar Presentación
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            disabled
          >
🎤 Grabar Audio
          </Button>
        </div>
      </div>

      <style jsx>{`
        .max-w-75 {
          max-width: 75% !important;
        }
        
        .messages-area::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-area::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .messages-area::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .messages-area::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default IndiChat;