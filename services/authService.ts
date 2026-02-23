// services/authService.ts

const API_BASE_URL = 'http://172.20.10.3:5000/api';

let _token: string | null = null;
let _currentUser: any = null;

export const authService = {

  async login(username, password) {

    try {

      const response = await fetch(`${API_BASE_URL}/auth/login`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })

      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      _token = data.token;
      _currentUser = data.user;
      
      return data;

    } catch (error) {
      throw error;
    }
  },

  // Añadimos 'name' como tercer parámetro
  async register(username, password, name) { 

    try {

      const response = await fetch(`${API_BASE_URL}/auth/register`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name })

      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      return data;

    } catch (error) {

      throw error;

    }

  },

  getToken() { return _token; },
  getCurrentUser() { return _currentUser; },
  logout() {
    _token = null;
    _currentUser = null;
  },

  // Añade esto a tu authService.ts
  async updateProfile(userId: number, userData: any) {

    try {

      const token = this.getToken();

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {

        method: 'PUT',

        headers: {

          'Content-Type': 'application/json',
          'Auth': `Bearer ${token}`

        },

        body: JSON.stringify(userData)

      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error updating profile');

      _currentUser = data.user;
      return data;
      
    } catch (error) {

      throw error;

    }

  },
  
};