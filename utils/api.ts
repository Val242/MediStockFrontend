// app/utils/api.ts
export const BASE_URL = 'http://10.214.103.72:3000';   // ← Change this to your real backend URL

// For local development on physical device / emulator, use your computer's IP
// Example: const BASE_URL = 'http://192.168.1.100:3000/api';

export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization here later if needed: `Bearer ${token}`
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error;
  }
};

//Fetch drugss
export const fetchDrugs = async (limit = 3, offset = 0) => {
  const response = await fetch(`${BASE_URL}/drugs?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch drugs: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

// Search drugs by name
export const searchDrugs = async (name: string): Promise<{ id: number; name: string }[]> => {
  const response = await fetch(`${BASE_URL}/drugs/search?name=${encodeURIComponent(name)}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
};


// Helper functions
export const get = <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' });

export const post = <T>(endpoint: string, body: any) =>
  apiCall<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });