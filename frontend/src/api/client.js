const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api');

export const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, token, headers = {} } = options;
  const requestHeaders = { ...headers };
  const config = { method, headers: requestHeaders };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

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
    throw new Error('Cannot reach the Raes Boutique server. Make sure the backend is running.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      data.message ||
      (response.status === 401
        ? 'Invalid email or password.'
        : response.status === 403
          ? 'You do not have permission to access this area.'
          : response.status === 404
            ? 'Requested resource was not found.'
            : `Request failed with status ${response.status}.`);

    throw new Error(errorMessage);
  }

  return data;
};

export { API_URL };
