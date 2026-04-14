// useSession hook - Manage interview sessions
import { useState } from 'react';
import { sessionAPI, metricsAPI } from '../services/endpoints';

export function useSession() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create session
  const createSession = async (sessionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionAPI.createSession(sessionData);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create session';
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Get all sessions
  const fetchSessions = async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionAPI.getSessions(page, limit, filters);
      setSessions(response.data.sessions || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sessions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get session by ID
  const getSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await sessionAPI.getSessionById(sessionId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start session
  const startSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await sessionAPI.startSession(sessionId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Pause session
  const pauseSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await sessionAPI.pauseSession(sessionId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to pause session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resume session
  const resumeSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await sessionAPI.resumeSession(sessionId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resume session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Complete session
  const completeSession = async (sessionId, completionData) => {
    try {
      setLoading(true);
      const response = await sessionAPI.completeSession(sessionId, completionData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel session
  const cancelSession = async (sessionId, reason = '') => {
    try {
      setLoading(true);
      const response = await sessionAPI.cancelSession(sessionId, reason);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete session
  const deleteSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await sessionAPI.deleteSession(sessionId);
      setSessions(sessions.filter(s => s._id !== sessionId));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add session note
  const addNote = async (sessionId, note) => {
    try {
      setLoading(true);
      const response = await sessionAPI.addSessionNote(sessionId, note);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    loading,
    error,
    createSession,
    fetchSessions,
    getSession,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    deleteSession,
    addNote,
  };
}

// useMetrics hook - Manage speech and confidence metrics
export function useMetrics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update speech metrics
  const updateSpeechMetrics = async (sessionId, metricsData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await metricsAPI.updateSpeechMetrics(sessionId, metricsData);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update speech metrics';
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Get speech metrics
  const getSpeechMetrics = async (sessionId) => {
    try {
      setLoading(true);
      const response = await metricsAPI.getSpeechMetrics(sessionId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch speech metrics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add speech insight
  const addSpeechInsight = async (sessionId, insight) => {
    try {
      setLoading(true);
      const response = await metricsAPI.addSpeechInsight(sessionId, insight);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add insight');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update confidence metrics
  const updateConfidenceMetrics = async (sessionId, metricsData) => {
    try {
      setLoading(true);
      const response = await metricsAPI.updateConfidenceMetrics(sessionId, metricsData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update confidence metrics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get confidence metrics
  const getConfidenceMetrics = async (sessionId) => {
    try {
      setLoading(true);
      const response = await metricsAPI.getConfidenceMetrics(sessionId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch confidence metrics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add confidence insight
  const addConfidenceInsight = async (sessionId, insight) => {
    try {
      setLoading(true);
      const response = await metricsAPI.addConfidenceInsight(sessionId, insight);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add insight');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add confidence timeline
  const addConfidenceTimeline = async (sessionId, timelineData) => {
    try {
      setLoading(true);
      const response = await metricsAPI.addConfidenceTimeline(sessionId, timelineData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add timeline');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get metrics summary
  const getMetricsSummary = async (sessionId) => {
    try {
      setLoading(true);
      const response = await metricsAPI.getMetricsSummary(sessionId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch metrics summary');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateSpeechMetrics,
    getSpeechMetrics,
    addSpeechInsight,
    updateConfidenceMetrics,
    getConfidenceMetrics,
    addConfidenceInsight,
    addConfidenceTimeline,
    getMetricsSummary,
  };
}
