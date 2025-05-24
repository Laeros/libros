<template>
  <div class="login-container">
    <form class="login-card" @submit.prevent="handleLogin">
      <h2>Iniciar Sesión</h2>

      <div class="form-group">
        <label for="username">Usuario</label>
        <input v-model="username" id="username" required placeholder="Ingresa tu usuario" />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          type="password"
          v-model="password"
          id="password"
          required
          placeholder="Ingresa tu contraseña"
        />
      </div>

      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
      const success = await authStore.login(username.value, password.value);
      if (success) {
        router.push('/');
      } else {
        alert('Credenciales incorrectas');
      }
    };

    return { username, password, handleLogin };
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: #ffffff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
}

input {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s ease;
}

input:focus {
  border-color: #3498db;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}
</style>
