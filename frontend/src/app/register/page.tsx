'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useForm } from 'react-hook-form';
import { authApi } from '@/services/apiClient';
import { RegisterDto } from '@/api/generated';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const validatePassword = (value: string) => {
    const minLength = value.length >= 8;
    const hasNumbers = (value.match(/\d/g) || []).length >= 2;
    const hasSymbols = (value.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 2;

    if (!minLength) {
      return 'Password must contain at least 8 characters';
    }
    if (!hasNumbers) {
      return 'Password must contain at least 2 numbers';
    }
    if (!hasSymbols) {
      return 'Password must contain at least 2 symbols';
    }
    return true;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);

    try {
      const registerDto: RegisterDto = {
        full_name: data.fullName,
        email: data.email,
        password: data.password,
      };

      const response = await authApi.authControllerRegister({ registerDto });

      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('An account with this email already exists');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  console.log(errors)
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
      
      {/* Right white section with register form */}
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
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
                color: 'text.primary',
              }}
            >
              Register for
            </Typography>
            <Typography
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
              Full Name
            </Typography>
            <TextField
              id="register-fullname"
              fullWidth
              variant="outlined"
              margin="normal"
              {...register('fullName', { required: 'Full name is required' })}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              sx={{
                mb: 2,
                mt: 0.5,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'neutral.lightest',
                },
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
              Email
            </Typography>
            <TextField
              id="register-email"
              fullWidth
              variant="outlined"
              margin="normal"
              {...register('email', {
                required: 'Enter a valid email address',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Enter a valid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
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
              id="register-password"
              fullWidth
              type="password"
              variant="outlined"
              margin="normal"
              {...register('password', {
                required: 'Password is required',
                validate: validatePassword,
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
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
              Re-Enter Password
            </Typography>
            <TextField
              id="register-password-2"
              fullWidth
              type="password"
              variant="outlined"
              margin="normal"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords must match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
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
                  Registering...
                </Box>
              ) : (
                <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                  Register
                </Box>
              )}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {'Already have an account? '}
                <Link
                  href="/login"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Login here.
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}