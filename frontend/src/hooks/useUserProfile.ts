import { useState, useEffect } from 'react';
import { usersApi } from '@/services/apiClient';
import { UpdateProfileDto } from '@/api/generated/models';

export const useUserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await usersApi.usersControllerGetProfile();
      setUser(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileDto) => {
    try {
      setLoading(true);
      const response = await usersApi.usersControllerUpdateProfile({
        updateProfileDto: data,
      });
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};