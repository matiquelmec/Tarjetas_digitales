'use client';

import { useMockSession } from '@/lib/mock-session';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useMockSession();

  // In demo mode, always allow access

  return <>{children}</>;
}