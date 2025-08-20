// API Backend Java - Configuration principale
const API_BASE_URL = "http://localhost:8080/api";

// Gestionnaire d'erreurs centralisé
export const handleApiError = (error: any) => {
  console.error("Backend API Error:", error);
  
  if (error.response?.status === 401) {
    // Token expiré ou invalide
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }
  
  if (error.response?.status === 403) {
    throw new Error("Accès non autorisé.");
  }
  
  throw new Error(error.response?.data?.message || error.message || "Erreur serveur");
};

// Configuration des headers avec token JWT
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Client HTTP générique
export const apiClient = {
  async get(endpoint: string, withAuth = true) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: withAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw await response.json();
    }
    
    return response.json();
  },

  async post(endpoint: string, data: any, withAuth = true) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: withAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw await response.json();
    }
    
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw await response.json();
    }
    
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw await response.json();
    }
    
    return response.json();
  }
};

export { API_BASE_URL };