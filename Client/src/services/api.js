// API Service for CampusLoop Lite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to handle fetch responses and error extraction
 */
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const apiService = {
  /**
   * Health check to check MongoDB and backend status
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await handleResponse(res);
    } catch (err) {
      return {
        status: 'error',
        message: 'Could not connect to backend server',
        database: { status: 'Disconnected' },
      };
    }
  },

  /**
   * Fetch aggregate statistics
   */
  async getStats() {
    const res = await fetch(`${API_BASE_URL}/listings/meta/stats`);
    return await handleResponse(res);
  },

  /**
   * Fetch all listings with optional filtering and sorting
   */
  async getListings({ search = '', category = 'All', listingType = 'All', status = 'All', sortBy = 'newest' } = {}) {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (category && category !== 'All') params.append('category', category);
    if (listingType && listingType !== 'All') params.append('listingType', listingType);
    if (status && status !== 'All') params.append('status', status);
    if (sortBy) params.append('sortBy', sortBy);

    const url = `${API_BASE_URL}/listings${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    return await handleResponse(res);
  },

  /**
   * Fetch single listing by ID
   */
  async getListingById(id) {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`);
    return await handleResponse(res);
  },

  /**
   * Create a new listing
   */
  async createListing(listingData) {
    const res = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingData),
    });
    return await handleResponse(res);
  },

  /**
   * Update an existing listing
   */
  async updateListing(id, listingData) {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingData),
    });
    return await handleResponse(res);
  },

  /**
   * Delete a listing by ID
   */
  async deleteListing(id) {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  },
};
