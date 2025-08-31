'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Tab,
  Tabs,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { usersApi } from '@/services/apiClient';
import { UpdateProfileDto } from '@/api/generated/models';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUserProfile } from '@/store/slices/userSlice';

interface ProfileFormData {
  full_name: string;
  email: string;
  phone_number: string;
  nok_name: string;
  nok_phone_number: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  country: string;
}

export default function ProfileForm() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.user.profile);
  
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      nok_name: '',
      nok_phone_number: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      country: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let profile = userProfile;
        profile ??= (await usersApi.usersControllerGetProfile()).data;

        reset({
          full_name: profile.full_name || '',
          email: profile.email || '',
          phone_number: profile.phone_number || '',
          nok_name: profile.nok_name || '',
          nok_phone_number: profile.nok_phone_number || '',
          address_line_1: profile.address_line_1 || '',
          address_line_2: profile.address_line_2 || '',
          city: profile.city || '',
          state: profile.state || '',
          country: profile.country || '',
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const updateData: UpdateProfileDto = {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number || undefined,
        nok_name: data.nok_name || undefined,
        nok_phone_number: data.nok_phone_number || undefined,
        address_line_1: data.address_line_1 || undefined,
        address_line_2: data.address_line_2 || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        country: data.country || undefined,
      };
      
      const updatedProfile = await usersApi.usersControllerUpdateProfile({ updateProfileDto: updateData });
      dispatch(setUserProfile(updatedProfile.data));

      setNotification({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error:any) {
      console.error('Failed to update profile:', error);

      let message = 'Failed to update profile.';
      if (error?.response?.data?.message != null)
        message = error.response.data.message;
      
      setNotification({ open: true, message: message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
        Profile
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
        </Tabs>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 0,
          backgroundColor: 'transparent',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1} columnSpacing={12} sx={{ justifyContent: 'flex-end', pb: 6 }}>
            {/* First Row */}
            <Grid size={{ xs: 12, md: 6 }}>
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
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                {...register('full_name', { required: 'Full name is required' })}
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                Address Line # 1
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                {...register('address_line_1')}
              />
            </Grid>

            {/* Second Row */}
            <Grid size={{ xs: 12, md: 6 }}>
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
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                type="email"
                {...register('email', { 
                  required: 'Enter a valid email address',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Enter a valid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                Address Line # 2
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                {...register('address_line_2')}
              />
            </Grid>

            {/* Third Row */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                Phone Number
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                {...register('phone_number')}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                City
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                {...register('city')}
              />
            </Grid>

            {/* Fourth Row */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                N.O.K (Next of Kin)
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                {...register('nok_name')}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                State
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                {...register('state')}
              />
            </Grid>

            {/* Fifth Row */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                N.O.K Phone Number
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                {...register('nok_phone_number')}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'flex-start',
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                Country
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                {...register('country')}
              />
            </Grid>

            <Grid 
              size={{ xs: 12 }}  
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                mt: 4,
                position: { xs: 'relative', lg: 'fixed' },
                bottom: { xs: 'auto', lg: 24 },
                right: { xs: 'auto', lg: 24 },
                zIndex: { xs: 'auto', lg: 1000 },
              }}
            >
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                size="large"
                sx={{
                  px: 8,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: 1,
                  boxShadow: { xs: 'none', lg: '0 4px 12px rgba(0, 0, 0, 0.15)' },
                  '&:hover': {
                    backgroundColor: '#1a1a1a',
                  },
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                  },
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
