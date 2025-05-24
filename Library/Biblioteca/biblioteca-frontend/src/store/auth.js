import { defineStore } from 'pinia';
import axios from 'axios';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !state.isTokenExpired,
    isTokenExpired: (state) => {
      if (!state.token) return true;
      const decoded = parseJwt(state.token);
      if (!decoded || !decoded.exp) return true;
      const now = Date.now() / 1000;
      return decoded.exp < now;
    },
  },
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('http://localhost:3000/login', { username, password });
        if (!response.data.token) {
          console.error('No token in response');
          return false;
        }

        this.token = response.data.token;
        localStorage.setItem('token', this.token);

        const decoded = parseJwt(this.token);
        if (decoded) {
          this.user = decoded;
          localStorage.setItem('user', JSON.stringify(this.user));
        } else {
          this.user = null;
          localStorage.removeItem('user');
        }

        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    loadUserFromStorage() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;

        try {
          this.user = JSON.parse(localStorage.getItem('user'));
        } catch {
          this.user = null;
          localStorage.removeItem('user');
        }

        if (this.isTokenExpired) {
          console.log('Token expirado, cerrando sesión automáticamente.');
          this.logout();
        }
      }
    }
  },
});
