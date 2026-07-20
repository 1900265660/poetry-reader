import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:8001/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPoem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/poems/${id}`);
      if (!response.ok) throw new Error('Failed to fetch poem');
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRandom = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/poems/random`);
      if (!response.ok) throw new Error('Failed to fetch random poem');
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPoems = useCallback(async (q, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q, page: page.toString() });
      const response = await fetch(`${API_BASE}/poems?${params}`);
      if (!response.ok) throw new Error('Failed to search poems');
      const data = await response.json();
      return { results: data.data };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchPoem, fetchRandom, searchPoems, loading, error };
}
