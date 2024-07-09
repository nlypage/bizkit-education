export const fetchWithAuth = async (url, options = {}) => {
    const authToken = localStorage.getItem('authToken');
  
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...options.headers,
      },
    });
  
    return response;
  };