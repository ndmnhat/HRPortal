'use client';

import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/services/apiClient';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUserProfile, setLoading, setError } from '@/store/slices/userSlice';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.user.profile);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      dispatch(setLoading(true));
      try {
        const profile = await usersApi.usersControllerGetProfile();
        dispatch(setUserProfile(profile.data));
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        dispatch(setError('Failed to fetch user profile'));
        // If unauthorized, redirect to login
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };

    fetchProfile();
  }, [router, dispatch]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        userName={userProfile?.full_name || 'User'} 
        userEmail={userProfile?.email || 'user@example.com'} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}