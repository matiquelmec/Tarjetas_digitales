'use client';

import BusinessCardGenerator from '../../components/BusinessCardGenerator';
import { AuthWrapper } from '../../components/AuthWrapper';

export default function BusinessCardGeneratorPage() {
  return (
    <AuthWrapper>
      <BusinessCardGenerator />
    </AuthWrapper>
  );
}
