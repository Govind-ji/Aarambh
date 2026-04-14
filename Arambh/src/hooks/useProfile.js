// useProfile hook - Manage user profile data
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/endpoints';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getProfile();
      setProfile(response.data.user || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.updateProfile(profileData);
      setProfile(response.data.user || response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user stats
  const getStats = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserStats();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !profile.email) {
      setProfile(user);
    }
  }, [user, profile.email]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    getStats,
  };
}
