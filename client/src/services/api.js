const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('flavora_token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateProfile(updates) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // User endpoints
  async getUserByUsername(username) {
    return this.request(`/users/${username}`);
  }

  async followUser(userId) {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
    });
  }

  async searchUsers(query) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  // Recipe endpoints
  async getRecipes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/recipes?${queryString}`);
  }

  async getRecipeById(id) {
    return this.request(`/recipes/${id}`);
  }

  async createRecipe(recipeData) {
    return this.request('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  }

  async updateRecipe(id, updates) {
    return this.request(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteRecipe(id) {
    return this.request(`/recipes/${id}`, {
      method: 'DELETE',
    });
  }

  async getTrendingRecipes() {
    return this.request('/recipes/trending');
  }

  async getFeedRecipes() {
    return this.request('/recipes/feed/list');
  }

  async getSavedRecipes() {
    return this.request('/recipes/saved/list');
  }

  async getLikedRecipes() {
    return this.request('/recipes/liked/list');
  }

  async getUserRecipes(userId) {
    return this.request(`/recipes/user/${userId}`);
  }

  // Recipe interactions
  async likeRecipe(recipeId) {
    return this.request(`/recipes/${recipeId}/like`, {
      method: 'POST',
    });
  }

  async saveRecipe(recipeId) {
    return this.request(`/recipes/${recipeId}/save`, {
      method: 'POST',
    });
  }

  async rateRecipe(recipeId, rating) {
    return this.request(`/recipes/${recipeId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  }

  async addComment(recipeId, text) {
    return this.request(`/recipes/${recipeId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }
}

export const api = new ApiService();
export default api;
