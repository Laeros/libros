<template>
  <form class="register-form" @submit.prevent="handleRegister">
    <h2>Crear Cuenta</h2>
    <div class="form-group">
      <label for="username">Usuario:</label>
      <input type="text" v-model="username" id="username" required placeholder="Ingresa tu usuario" />
    </div>
    <div class="form-group">
      <label for="password">Contraseña:</label>
      <input type="password" v-model="password" id="password" required placeholder="Ingresa tu contraseña" />
    </div>
    <button type="submit">Registrarse</button>
  </form>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const router = useRouter();

    const handleRegister = async () => {
      if (!username.value || !password.value) {
        alert("Todos los campos son obligatorios");
        return;
      }

      try {
        await axios.post('http://localhost:3000/users', {
          username: username.value,
          password: password.value,
        });
        alert('Usuario registrado con éxito');
        router.push('/login');
      } catch (error) {
        const message = error.response?.data?.message || 'Error al registrar usuario';
        alert(message);
      }
    };

    return { username, password, handleRegister };
  },
};
</script>

<style scoped>
.register-form {
  max-width: 380px;
  margin: 3rem auto;
  padding: 2.5rem 2rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  text-align: center;
}

.register-form h2 {
  margin-bottom: 1.8rem;
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.6rem 1rem;
  border: 1.8px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

button {
  width: 100%;
  padding: 0.75rem 0;
  background-color: #3498db;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.8rem;
}

button:hover {
  background-color: #2980b9;
}
</style>
