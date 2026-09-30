/**
 * Centralized API Service for BizAI Command Center
 * Injects JWT Bearer token and active organization ID
 */

// Keep the development proxy as the default, but allow deployed builds to point
// at their API gateway with VITE_API_URL.  The previous hard-coded value made
// authentication fail as soon as the frontend and API were hosted separately.
const configuredApiBase = import.meta.env.VITE_API_URL?.trim();
const API_BASE = (configuredApiBase || '/api/v1').replace(/\/+$/, '');

export const getAuthToken = () => localStorage.getItem('bizai_token');
export const setAuthToken = (token) => localStorage.setItem('bizai_token', token);
export const removeAuthToken = () => localStorage.removeItem('bizai_token');

export const getStoredOrgId = () => localStorage.getItem('bizai_org_id');
export const setStoredOrgId = (id) => localStorage.setItem('bizai_org_id', id);

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const orgId = getStoredOrgId();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(orgId ? { 'x-organization-id': orgId } : {}),
    ...(options.headers || {})
  };

  // If sending FormData (file uploads), let browser set Content-Type with boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
  } catch (cause) {
    const error = new Error('Unable to reach the server. Please check your connection and try again.');
    error.code = 'NETWORK_ERROR';
    error.cause = cause;
    throw error;
  }

  const isJson = (response.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = data?.error?.message || response.statusText || 'An unexpected error occurred';
    if (data?.error?.details && Array.isArray(data.error.details) && data.error.details.length > 0) {
      const detailsMsg = data.error.details
        .map(d => typeof d === 'string' ? d : (d.message ? `${d.path ? d.path.join('.') + ': ' : ''}${d.message}` : null))
        .filter(Boolean)
        .join('; ');
      if (detailsMsg && !errorMessage.includes(detailsMsg)) {
        errorMessage = `${errorMessage} (${detailsMsg})`;
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.code = data?.error?.code || 'API_ERROR';
    error.details = data?.error?.details || [];
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body), ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body), ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),

  // Blob/File download
  download: async (endpoint, filename) => {
    const token = getAuthToken();
    const orgId = getStoredOrgId();
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(orgId ? { 'x-organization-id': orgId } : {})
      }
    });
    if (!res.ok) throw new Error('File download failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};
