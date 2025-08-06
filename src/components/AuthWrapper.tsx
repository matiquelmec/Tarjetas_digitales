'use client';

import { useSession, signIn } from 'next-auth/react';
import { Container, Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="text-center">
          <Card.Body>
            <Card.Title>Authentication Required</Card.Title>
            <Card.Text>Please sign in to access this page.</Card.Text>
            <Button variant="primary" onClick={() => signIn('google')}>
              Sign In with Google
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return <>{children}</>;
}