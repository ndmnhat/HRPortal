'use client';

import React from 'react';
import { Container } from '@mui/material';
import ProfileForm from '@/components/ProfileForm';

export default function DashboardPage() {
  return (
    <Container maxWidth="lg">
      <ProfileForm />
    </Container>
  );
}