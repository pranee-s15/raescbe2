const baseUrl = '';
const API_URL = `${baseUrl}/api`;
export const IS_FRONTEND_ONLY = true;

export const apiRequest = async (path, options = {}) => {
  if (IS_FRONTEND_ONLY) {
    throw new Error('Frontend-only demo mode is active.');
  }

  const { method = 'GET', body, token, headers = {} } = options;

  const requestHeaders = { ...headers };
  const config = {
    method,
    headers: requestHeaders,
  };

  // Add token if exists
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // Handle body
  if (body instanceof FormData) {
    config.body = body;
  } else if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, config);
  } catch (error) {
    throw new Error('Cannot reach the server. Backend might be sleeping or down.');
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // Handle errors
  if (!response.ok) {
    const errorMessage =
      data.message ||
      (response.status === 401
        ? 'Invalid email or password.'
        : response.status === 403
        ? 'You do not have permission.'
        : response.status === 404
        ? 'Resource not found.'
        : `Request failed with status ${response.status}`);

    throw new Error(errorMessage);
  }

  return data;
};

export { API_URL };
