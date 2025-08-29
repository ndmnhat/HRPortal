'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/solid';
import { authApi } from '@/services/apiClient';
import { LoginDto } from '@/api/generated/models';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginDto: LoginDto = {
        email,
        password,
      };
      
      const response = await authApi.authControllerLogin({ loginDto });

      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      setError('The email or password is in-correct!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'background.default',
      }}
    >
      {/* Left gray section */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: 'neutral.lighter',
          display: { xs: 'none', md: 'block' },
        }}
      />
      
      {/* Right white section with login form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          padding: 4,
        }}
      >
        <Container maxWidth="xs">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 4,
                color: 'text.primary',
              }}
            >
              Domain Checker
            </Typography>


            <Typography
              variant="body2"
              sx={{
                alignSelf: 'flex-start',
                mb: 0.5,
                color: 'text.primary',
              }}
            >
              Email
            </Typography>
            <TextField
              id="login-email"
              fullWidth
              variant="outlined"
              margin="normal"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 2,
                mt: 0.5,
              }}
            />

            <Typography
              variant="body2"
              sx={{
                alignSelf: 'flex-start',
                mb: 0.5,
                color: 'text.primary',
              }}
            >
              Password
            </Typography>
            <TextField
              id="login-password"
              fullWidth
              variant="outlined"
              margin="normal"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 2,
                mt: 0.5,
              }}
            />

            {error && (
              <Box
                sx={{
                  width: '100%',
                  mb: 2,
                  py: 1.5,
                  px: 2,
                  backgroundColor: 'error.main',
                  color: 'common.white',
                  textAlign: 'center',
                  borderRadius: 1,
                  fontSize: '14px',
                }}
              >
                {error}
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color={success ? "success" : "primary"}
              disabled={loading || success}
              sx={{
                py: 1.5,
                fontSize: '16px',
              }}
            >
              {success ? (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  animation: 'fadeIn 0.3s ease-in-out'
                }}>
                  <CheckIcon style={{ 
                    width: 20, 
                    height: 20,
                    animation: 'scaleIn 0.3s ease-in-out'
                  }} />
                  Success!
                </Box>
              ) : loading ? (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  animation: 'fadeIn 0.3s ease-in-out'
                }}>
                  <CircularProgress size={20} color="inherit" />
                  Logging in...
                </Box>
              ) : (
                <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                  Login
                </Box>
              )}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {"Don't have an account? "}
                <Link
                  href="/register"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Register here.
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}