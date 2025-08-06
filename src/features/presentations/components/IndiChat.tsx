'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useIndiResearch } from '../hooks/useIndiResearch';
import { useIndi } from '@/hooks/useIndi';
import type { ConversationMessage } from '../types/research';

interface IndiChatProps {
  onPresentationGenerated?: (presentationId: string) => void;
  className?: string;
}

const IndiChat: React.FC<IndiChatProps> = ({ onPresentationGenerated, className = '' }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { currentState, message: indiMessage, isVisible } = useIndi();
  const {
    conversationState,
    isLoading,
    error,
    sendMessage,
    generatePresentation,
    startNewConversation,
    canGenerate,
    hasResearchData
  } = useIndiResearch();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationState.messages]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGeneratePresentation = async () => {
    const presentationId = await generatePresentation();
    if (presentationId && onPresentationGenerated) {
      onPresentationGenerated(presentationId);
    }
  };

  const renderMessage = (msg: ConversationMessage) => {
    const isUser = msg.role === 'user';
    
    return (
      <div key={msg.id} className={`message ${isUser ? 'user-message' : 'indi-message'}`}>
        <div className="message-avatar">
          {isUser ? (
            <div className="user-avatar">👤</div>
          ) : (
            <div className="indi-avatar">🛸</div>
          )}
        </div>
        <div className="message-content">
          <div className="message-bubble">
            {msg.content}
          </div>
          <div className="message-time">
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        .indi-chat {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .chat-header {
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .chat-title {
          color: #00f6ff;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .chat-subtitle {
          color: #a0a0a0;
          font-size: 0.85rem;
          margin: 5px 0 0 0;
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          max-height: 400px;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(0, 246, 255, 0.3);
          border-radius: 3px;
        }

        .message {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
          animation: messageSlideIn 0.3s ease-out;
        }

        .message.user-message {
          flex-direction: row-reverse;
        }

        .message-avatar {
          flex-shrink: 0;
          margin: 0 12px;
        }

        .user-avatar, .indi-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          background: linear-gradient(135deg, #00f6ff 0%, #0099cc 100%);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .indi-avatar {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          animation: pulse 2s infinite;
        }

        .message-content {
          flex: 1;
          max-width: 70%;
        }

        .message-bubble {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 12px 18px;
          color: #eaeaea;
          font-size: 0.95rem;
          line-height: 1.4;
          white-space: pre-wrap;
          backdrop-filter: blur(10px);
        }

        .user-message .message-bubble {
          background: rgba(0, 246, 255, 0.2);
          border-color: rgba(0, 246, 255, 0.3);
          color: #fff;
        }

        .message-time {
          font-size: 0.75rem;
          color: #666;
          margin-top: 5px;
          text-align: right;
        }

        .user-message .message-time {
          text-align: left;
        }

        .chat-input-area {
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .input-container {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          margin-bottom: 15px;
        }

        .message-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 12px 20px;
          color: #eaeaea;
          font-size: 0.95rem;
          resize: none;
          min-height: 45px;
          max-height: 120px;
          transition: all 0.3s ease;
        }

        .message-input:focus {
          outline: none;
          border-color: #00f6ff;
          box-shadow: 0 0 20px rgba(0, 246, 255, 0.3);
          background: rgba(255, 255, 255, 0.15);
        }

        .message-input::placeholder {
          color: #888;
        }

        .send-button {
          background: linear-gradient(135deg, #00f6ff 0%, #0099cc 100%);
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .send-button:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 246, 255, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .action-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 8px 16px;
          color: #eaeaea;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-button:hover {
          background: rgba(0, 246, 255, 0.2);
          border-color: #00f6ff;
          color: #00f6ff;
        }

        .action-button.primary {
          background: linear-gradient(135deg, #00f6ff 0%, #0099cc 100%);
          border-color: #00f6ff;
          color: white;
        }

        .action-button.primary:hover {
          box-shadow: 0 5px 15px rgba(0, 246, 255, 0.4);
        }

        .loading-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #00f6ff;
          font-size: 0.9rem;
        }

        .loading-dots {
          margin-left: 10px;
        }

        .error-message {
          background: rgba(255, 107, 107, 0.2);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 10px;
          padding: 15px;
          color: #ff6b6b;
          margin: 10px 20px;
          font-size: 0.9rem;
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #888;
        }

        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .empty-state-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #00f6ff;
          margin-bottom: 10px;
        }

        .empty-state-text {
          font-size: 0.9rem;
          line-height: 1.5;
        }
      `}</style>

      <div className={`indi-chat ${className}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <h3 className="chat-title">
            🛸 Indi Research & Create
          </h3>
          <p className="chat-subtitle">
            Tu embajador intergaláctico para presentaciones hipnotizantes
          </p>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {conversationState.messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🌟</div>
              <div className="empty-state-title">¡Hola terrícola!</div>
              <div className="empty-state-text">
                Soy Indi, tu embajador intergaláctico. Estoy aquí para ayudarte a crear 
                presentaciones increíbles. ¡Cuéntame sobre qué tema quieres presentar!
              </div>
            </div>
          ) : (
            conversationState.messages.map(renderMessage)
          )}
          
          {isLoading && (
            <div className="loading-indicator">
              <span>Indi está procesando...</span>
              <div className="loading-dots">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              className="message-input"
              placeholder="Escribe tu mensaje para Indi..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              🚀
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            {canGenerate && (
              <button 
                className="action-button primary" 
                onClick={handleGeneratePresentation}
                disabled={isLoading}
              >
                ✨ Generar Presentación
              </button>
            )}
            
            <button 
              className="action-button" 
              onClick={startNewConversation}
              disabled={isLoading}
            >
              🔄 Nueva Conversación
            </button>
            
            {hasResearchData && (
              <button className="action-button">
                📊 Ver Investigación ({conversationState.researchData?.sources.length || 0} fuentes)
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndiChat;