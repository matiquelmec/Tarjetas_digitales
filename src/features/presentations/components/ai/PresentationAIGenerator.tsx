/**
 * 🤖 PresentationAIGenerator - Componente Principal para Generación con IA
 * 
 * Interfaz completa para cargar documentos y generar presentaciones
 * usando el sistema PresentationMind AI multi-agente.
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Alert, 
  ProgressBar, 
  Row, 
  Col, 
  Badge,
  Collapse,
  InputGroup,
  Tabs,
  Tab
} from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { processFile, validateText } from '@/utils/fileProcessors';

interface PresentationAIGeneratorProps {
  onPresentationGenerated: (presentation: any) => void;
  onError?: (error: string) => void;
}

interface GenerationState {
  isGenerating: boolean;
  currentStep: string;
  progress: number;
  estimatedTime: number;
  startTime: number | null;
}

interface UsageInfo {
  presentationsThisMonth: number;
  planLimit: number | string;
  remainingGenerations: number | string;
  plan: string;
  capabilities: {
    maxDocumentLength: number;
    researchEnabled: boolean;
    maxDuration: number;
    customInstructions: boolean;
    priorityProcessing: boolean;
  };
}

export default function PresentationAIGenerator({ 
  onPresentationGenerated, 
  onError 
}: PresentationAIGeneratorProps) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados principales
  const [document, setDocument] = useState('');
  const [title, setTitle] = useState('');
  const [audienceType, setAudienceType] = useState<string>('corporate');
  const [duration, setDuration] = useState(15);
  const [objective, setObjective] = useState<string>('inform');
  const [interactivityLevel, setInteractivityLevel] = useState<string>('medium');
  const [requiresResearch, setRequiresResearch] = useState(true);
  const [customInstructions, setCustomInstructions] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Estados de control
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    currentStep: '',
    progress: 0,
    estimatedTime: 0,
    startTime: null
  });
  
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Cargar información de uso al montar
  React.useEffect(() => {
    loadUsageInfo();
  }, []);

  const loadUsageInfo = async () => {
    try {
      const response = await fetch('/api/presentations/ai-generate');
      if (response.ok) {
        const data = await response.json();
        setUsageInfo(data);
      }
    } catch (error) {
      console.error('Error loading usage info:', error);
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    
    try {
      const result = await processFile(file);
      
      if (!result.success) {
        setError(result.message);
        return;
      }
      
      // Verificar límite de longitud según el plan
      const maxLength = usageInfo?.capabilities.maxDocumentLength || 5000;
      
      if (result.text.length > maxLength) {
        setError(`El documento es muy largo. Máximo permitido: ${maxLength.toLocaleString()} caracteres. Actual: ${result.text.length.toLocaleString()}`);
        return;
      }
      
      setDocument(result.text);
      
      // Generar título automáticamente si está vacío
      if (!title && result.text.length > 100) {
        const firstLine = result.text.split('\n')[0];
        if (firstLine.length > 5 && firstLine.length < 100) {
          setTitle(firstLine);
        }
      }
      
    } catch (error) {
      setError('Error procesando el archivo. Intenta copiando y pegando el texto directamente.');
    }
  }, [usageInfo, title]);

  const simulateProgress = (targetProgress: number, stepName: string) => {
    setGenerationState(prev => ({
      ...prev,
      currentStep: stepName,
      progress: Math.min(targetProgress, prev.progress + 2)
    }));
  };

  const generatePresentation = async () => {
    if (!document || !title) {
      setError('Por favor, sube un documento y proporciona un título');
      return;
    }

    if (usageInfo && typeof usageInfo.remainingGenerations === 'number' && usageInfo.remainingGenerations <= 0) {
      setError(`Has alcanzado el límite de tu plan (${usageInfo.planLimit} presentaciones por mes). Actualiza tu plan para continuar.`);
      return;
    }

    let progressInterval: NodeJS.Timeout;

    try {
      setError('');
      setSuccessMessage('');
      setGenerationState({
        isGenerating: true,
        currentStep: 'Iniciando análisis de documento...',
        progress: 0,
        estimatedTime: Math.ceil(document.length / 50), // Estimación básica
        startTime: Date.now()
      });

      // Simulación de progreso mientras se procesa
      progressInterval = setInterval(() => {
        setGenerationState(prev => {
          if (prev.progress >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          
          let newProgress = prev.progress;
          let stepName = prev.currentStep;
          
          if (prev.progress < 20) {
            newProgress = prev.progress + 3;
            stepName = '📖 Analizando contenido del documento...';
          } else if (prev.progress < 40) {
            newProgress = prev.progress + 2;
            stepName = '🎯 Creando plan estratégico de presentación...';
          } else if (prev.progress < 60 && requiresResearch) {
            newProgress = prev.progress + 1.5;
            stepName = '🔍 Investigando datos actualizados...';
          } else if (prev.progress < 80) {
            newProgress = prev.progress + 2;
            stepName = '✨ Creando slides con storytelling...';
          } else if (prev.progress < 95) {
            newProgress = prev.progress + 1;
            stepName = '🎪 Agregando elementos interactivos...';
          }
          
          return {
            ...prev,
            progress: Math.min(newProgress, 95),
            currentStep: stepName
          };
        });
      }, 800);

      const requestBody = {
        document: document.trim(),
        title: title.trim(),
        audienceType,
        duration,
        objective,
        interactivityLevel,
        requiresResearch: requiresResearch && usageInfo?.capabilities.researchEnabled,
        customInstructions: customInstructions.trim() || undefined
      };

      const response = await fetch('/api/presentations/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error del servidor (${response.status})`);
      }

      const result = await response.json();

      setGenerationState(prev => ({
        ...prev,
        currentStep: '🎉 ¡Presentación completada exitosamente!',
        progress: 100
      }));

      // Mostrar resultados
      const processingTime = Math.round((Date.now() - (generationState.startTime || 0)) / 1000);
      setSuccessMessage(
        `Presentación generada exitosamente en ${processingTime}s. ` +
        `Calidad: ${result.metrics.qualityScore}/10. ` +
        `${result.presentation.totalSlides} slides creados.`
      );

      // Actualizar información de uso
      await loadUsageInfo();

      // Notificar al componente padre
      onPresentationGenerated(result.presentation);

      // Reset form
      setTimeout(() => {
        setDocument('');
        setTitle('');
        setCustomInstructions('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setGenerationState({
          isGenerating: false,
          currentStep: '',
          progress: 0,
          estimatedTime: 0,
          startTime: null
        });
      }, 2000);

    } catch (error) {
      clearInterval(progressInterval);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      onError?.(errorMessage);
      
      setGenerationState({
        isGenerating: false,
        currentStep: '',
        progress: 0,
        estimatedTime: 0,
        startTime: null
      });
    }
  };

  const isFormValid = document.length >= 100 && title.length >= 3;
  const canGenerate = isFormValid && !generationState.isGenerating && 
    (typeof usageInfo?.remainingGenerations !== 'number' || usageInfo.remainingGenerations > 0);

  return (
    <div>
      <style jsx global>{`
        .ai-generator-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(15px);
        }
        
        .usage-badge {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          color: white;
          border-radius: 12px;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 0.85rem;
          border: none;
        }
        
        .usage-info {
          background: rgba(0, 246, 255, 0.1);
          border: 1px solid rgba(0, 246, 255, 0.3);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .progress-container {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1rem 0;
        }
        
        .progress-step {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .progress-bar {
          height: 8px;
          border-radius: 4px;
          background: #e9ecef;
          overflow: hidden;
        }
        
        .progress-bar .progress-bar {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        
        .form-control:focus {
          border-color: #00f6ff;
          box-shadow: 0 0 0 0.2rem rgba(0, 246, 255, 0.25);
        }
        
        .btn-generate-ai {
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          border: none;
          color: white;
          border-radius: 16px;
          padding: 12px 32px;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 246, 255, 0.3);
        }
        
        .btn-generate-ai:hover:not(:disabled) {
          background: linear-gradient(135deg, #00d4e7, #0056cc);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 246, 255, 0.4);
        }
        
        .btn-generate-ai:disabled {
          background: #6c757d;
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .advanced-options {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid #e9ecef;
        }
        
        .file-upload-area {
          border: 2px dashed #00f6ff;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          background: rgba(0, 246, 255, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .file-upload-area:hover {
          background: rgba(0, 246, 255, 0.1);
          border-color: #0072ff;
        }
        
        .file-upload-area.has-content {
          border-color: #28a745;
          background: rgba(40, 167, 69, 0.05);
        }
        
        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #00f6ff;
        }
        
        .upload-text {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }
        
        .upload-hint {
          color: #666;
          font-size: 0.9rem;
        }
        
        .audience-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .audience-option {
          padding: 8px 12px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          background: white;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .audience-option:hover {
          border-color: #00f6ff;
          background: rgba(0, 246, 255, 0.05);
        }
        
        .audience-option.active {
          border-color: #00f6ff;
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          color: white;
        }
        
        .objective-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .objective-option {
          padding: 8px 12px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          background: white;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .objective-option:hover {
          border-color: #00f6ff;
          background: rgba(0, 246, 255, 0.05);
        }
        
        .objective-option.active {
          border-color: #00f6ff;
          background: linear-gradient(135deg, #00f6ff, #0072ff);
          color: white;
        }
        
        .feature-tag {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 8px;
        }
        
        .plan-upgrade-hint {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 12px;
          padding: 1rem;
          margin: 1rem 0;
        }
        
        .plan-upgrade-hint h6 {
          color: #856404;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .plan-upgrade-hint p {
          color: #856404;
          margin: 0;
          font-size: 0.9rem;
        }
      `}</style>

      <Card className="ai-generator-card">
        <Card.Header className="bg-transparent border-0 pb-0">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-1">
                🤖 Generador de Presentaciones con IA
              </h5>
              <p className="text-muted mb-0 small">
                Transforma documentos en presentaciones profesionales automáticamente
              </p>
            </Col>
            <Col xs="auto">
              {usageInfo && (
                <Badge className="usage-badge">
                  Plan {usageInfo.plan}: {usageInfo.remainingGenerations} restantes
                </Badge>
              )}
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {/* Información de uso */}
          {usageInfo && (
            <div className="usage-info">
              <Row className="text-center">
                <Col md={3}>
                  <div className="mb-2">
                    <strong>{usageInfo.presentationsThisMonth}</strong>
                    <div className="small text-muted">Este mes</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-2">
                    <strong>{usageInfo.planLimit}</strong>
                    <div className="small text-muted">Límite mensual</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-2">
                    <strong>{usageInfo.capabilities.maxDocumentLength.toLocaleString()}</strong>
                    <div className="small text-muted">Caracteres máx.</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-2">
                    <strong>{usageInfo.capabilities.maxDuration} min</strong>
                    <div className="small text-muted">Duración máx.</div>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          {/* Alertas */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <Alert.Heading>Error</Alert.Heading>
              <p className="mb-0">{error}</p>
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
              <Alert.Heading>¡Éxito!</Alert.Heading>
              <p className="mb-0">{successMessage}</p>
            </Alert>
          )}

          {/* Progreso de generación */}
          {generationState.isGenerating && (
            <div className="progress-container">
              <div className="progress-step">{generationState.currentStep}</div>
              <ProgressBar 
                now={generationState.progress} 
                className="mb-2"
                animated
                striped
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>Progreso: {Math.round(generationState.progress)}%</span>
                <span>
                  {generationState.startTime && 
                    `${Math.round((Date.now() - generationState.startTime) / 1000)}s transcurridos`
                  }
                </span>
              </div>
            </div>
          )}

          <Form onSubmit={(e) => { e.preventDefault(); generatePresentation(); }}>
            {/* Input de documento con pestañas */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                📄 Contenido del Documento
                <span className="text-danger">*</span>
              </Form.Label>
              
              <Tabs defaultActiveKey="text" id="document-input-tabs" className="mb-3">
                <Tab eventKey="text" title="✏️ Escribir/Pegar Texto">
                  <Form.Control
                    as="textarea"
                    rows={10}
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="Pega aquí el contenido de tu documento o escríbelo directamente...

Por ejemplo:
- Informe ejecutivo de la empresa
- Artículo o investigación
- Propuesta de proyecto
- Plan de negocio
- Cualquier texto que quieras convertir en presentación

Mínimo 100 caracteres para crear una presentación efectiva."
                    disabled={generationState.isGenerating}
                    maxLength={usageInfo?.capabilities.maxDocumentLength || 50000}
                    style={{ minHeight: '300px' }}
                  />
                  <Form.Text className="text-muted">
                    {document.length.toLocaleString()} / {(usageInfo?.capabilities.maxDocumentLength || 50000).toLocaleString()} caracteres
                  </Form.Text>
                </Tab>
                
                <Tab eventKey="upload" title="📤 Subir Archivo">
                  <div 
                    className={`file-upload-area ${document ? 'has-content' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="upload-icon">
                      {document ? '✅' : '📤'}
                    </div>
                    <div className="upload-text">
                      {document ? `Archivo procesado (${document.length.toLocaleString()} caracteres)` : 'Click para subir archivo'}
                    </div>
                    <div className="upload-hint">
                      {document ? 'Click para cambiar archivo' : 'Solo archivos .txt por ahora. Para PDF/Word, copia y pega el texto en la pestaña anterior.'}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      disabled={generationState.isGenerating}
                    />
                  </div>
                </Tab>
              </Tabs>
            </Form.Group>

            {/* Título de la presentación */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                ✨ Título de la Presentación
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej: Estrategia Digital 2025"
                maxLength={100}
                disabled={generationState.isGenerating}
              />
              <Form.Text className="text-muted">
                {title.length}/100 caracteres
              </Form.Text>
            </Form.Group>

            {/* Tipo de audiencia */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">👥 Tipo de Audiencia</Form.Label>
              <div className="audience-selector">
                {[
                  { value: 'startup', label: '🚀 Startup', desc: 'Emprendedores' },
                  { value: 'corporate', label: '🏢 Corporativa', desc: 'Ejecutivos' },
                  { value: 'academic', label: '🎓 Académica', desc: 'Investigadores' },
                  { value: 'sales', label: '💼 Ventas', desc: 'Comercial' },
                  { value: 'training', label: '📚 Capacitación', desc: 'Educativo' }
                ].map(audience => (
                  <div
                    key={audience.value}
                    className={`audience-option ${audienceType === audience.value ? 'active' : ''}`}
                    onClick={() => !generationState.isGenerating && setAudienceType(audience.value)}
                  >
                    <div>{audience.label}</div>
                    <div className="small">{audience.desc}</div>
                  </div>
                ))}
              </div>
            </Form.Group>

            {/* Duración y objetivo */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">⏱️ Duración (minutos)</Form.Label>
                  <Form.Range
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    min={5}
                    max={usageInfo?.capabilities.maxDuration || 60}
                    disabled={generationState.isGenerating}
                  />
                  <div className="d-flex justify-content-between small text-muted">
                    <span>5 min</span>
                    <span className="fw-bold">{duration} minutos</span>
                    <span>{usageInfo?.capabilities.maxDuration || 60} min</span>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">🎯 Objetivo Principal</Form.Label>
                  <div className="objective-selector">
                    {[
                      { value: 'inform', label: 'Informar' },
                      { value: 'persuade', label: 'Persuadir' },
                      { value: 'sell', label: 'Vender' },
                      { value: 'teach', label: 'Enseñar' },
                      { value: 'inspire', label: 'Inspirar' }
                    ].map(obj => (
                      <div
                        key={obj.value}
                        className={`objective-option ${objective === obj.value ? 'active' : ''}`}
                        onClick={() => !generationState.isGenerating && setObjective(obj.value)}
                      >
                        {obj.label}
                      </div>
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Opciones avanzadas */}
            <div className="mb-4">
              <Button
                variant="link"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="p-0 text-decoration-none fw-bold"
                disabled={generationState.isGenerating}
              >
                ⚙️ Opciones Avanzadas {showAdvancedOptions ? '▼' : '▶'}
              </Button>
              
              <Collapse in={showAdvancedOptions}>
                <div className="advanced-options mt-3">
                  {/* Nivel de interactividad */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">🎪 Nivel de Interactividad</Form.Label>
                    <Form.Select 
                      value={interactivityLevel} 
                      onChange={(e) => setInteractivityLevel(e.target.value)}
                      disabled={generationState.isGenerating}
                    >
                      <option value="low">Bajo - Pocas actividades</option>
                      <option value="medium">Medio - Balance ideal</option>
                      <option value="high">Alto - Muy interactiva</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Investigación con IA */}
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="requiresResearch"
                      checked={requiresResearch}
                      onChange={(e) => setRequiresResearch(e.target.checked)}
                      disabled={generationState.isGenerating || !usageInfo?.capabilities.researchEnabled}
                      label={
                        <span>
                          🔍 Investigar datos actualizados con IA
                          {usageInfo?.capabilities.researchEnabled && (
                            <span className="feature-tag">PREMIUM</span>
                          )}
                        </span>
                      }
                    />
                    <Form.Text className="text-muted">
                      Busca estadísticas actuales, tendencias y casos de estudio relevantes
                    </Form.Text>
                  </Form.Group>

                  {/* Instrucciones personalizadas */}
                  {usageInfo?.capabilities.customInstructions && (
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        📝 Instrucciones Personalizadas
                        <span className="feature-tag">PRO</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="ej: Enfócate en métricas financieras, incluye más ejemplos prácticos..."
                        disabled={generationState.isGenerating}
                        maxLength={500}
                      />
                      <Form.Text className="text-muted">
                        {customInstructions.length}/500 caracteres
                      </Form.Text>
                    </Form.Group>
                  )}
                </div>
              </Collapse>
            </div>

            {/* Upgrade hint para usuarios FREE */}
            {usageInfo?.plan === 'FREE' && (
              <div className="plan-upgrade-hint">
                <h6>🚀 Desbloquea Todo el Potencial</h6>
                <p>
                  Actualiza a PRO para: Investigación con IA • Documentos más largos • 
                  Instrucciones personalizadas • Procesamiento prioritario
                </p>
              </div>
            )}

            {/* Botón de generación */}
            <div className="text-center">
              <Button
                type="submit"
                className="btn-generate-ai"
                disabled={!canGenerate}
                size="lg"
              >
                {generationState.isGenerating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Generando Presentación...
                  </>
                ) : (
                  <>
                    <span className="me-2">🤖</span>
                    Generar Presentación con IA
                  </>
                )}
              </Button>
              
              {!isFormValid && (
                <div className="small text-muted mt-2">
                  {!document && 'Sube un documento • '}
                  {!title && 'Agrega un título • '}
                  {document && document.length < 100 && 'El documento debe tener al menos 100 caracteres'}
                </div>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}