// useSettings hook - Manage user settings
import { useState, useEffect } from 'react';
import { settingsAPI } from '../services/endpoints';

export function useSettings() {
  const [settings, setSettings] = useState({
    interviewSettings: {},
    mediaSettings: {},
    notificationSettings: {},
    displaySettings: {},
    privacySettings: {},
    analyticsSettings: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsAPI.getSettings();
      setSettings(response.data.settings || response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch settings';
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Update interview settings
  const updateInterviewSettings = async (settingsData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsAPI.updateInterviewSettings(settingsData);
      setSettings(prev => ({
        ...prev,
        interviewSettings: response.data.settings?.interviewSettings || {}
      }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update interview settings';
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Update media settings
  const updateMediaSettings = async (settingsData) => {
    try {
      setLoading(true);
      const response = await settingsAPI.updateMediaSettings(settingsData);
      setSettings(prev => ({
        ...prev,
        mediaSettings: response.data.settings?.mediaSettings || {}
      }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update media settings';
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Update notification settings
  const updateNotificationSettings = async (settingsData) => {
    try {
      setLoading(true);
      const response = await settingsAPI.updateNotificationSettings(settingsData);
      setSettings(prev => ({
        ...prev,
        notificationSettings: response.data.settings?.notificationSettings || {}
      }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update notification settings';
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Update display settings
  const updateDisplaySettings = async (settingsData) => {
    try {
      setLoading(true);
      const response = await settingsAPI.updateDisplaySettings(settingsData);
      setSettings(prev => ({
        ...prev,
        displaySettings: response.data.settings?.displaySettings || {}
      }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update display settings';
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Update privacy settings
  const updatePrivacySettings = async (settingsData) => {
    try {
      setLoading(true);
      const response = await settingsAPI.updatePrivacySettings(settingsData);
      setSettings(prev => ({
        ...prev,
        privacySettings: response.data.settings?.privacySettings || {}
      }));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update privacy settings';
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Reset settings to defaults
  const resetSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.resetSettings();
      setSettings(response.data.settings || response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset settings';
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Load settings on mount
  useEffect(() => {
    fetchSettings().catch(console.error);
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateInterviewSettings,
    updateMediaSettings,
    updateNotificationSettings,
    updateDisplaySettings,
    updatePrivacySettings,
    resetSettings,
  };
}
