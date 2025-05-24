<template>
  <nav class="navbar">
    <router-link class="nav-link" to="/">Inicio</router-link>
    <div class="nav-right">
      <template v-if="isLoggedIn">
        <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
        <button class="btn-logout" @click="logout">Cerrar sesión</button>
      </template>
      <template v-else>
        <router-link class="nav-link" to="/login">Iniciar sesión</router-link>
        <router-link class="nav-link" to="/register">Registrarse</router-link>
      </template>
    </div>
  </nav>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    // Cargar usuario y token desde localStorage al montar el componente
    onMounted(() => {
      authStore.loadUserFromStorage();
    });

    const isLoggedIn = computed(() => authStore.isLoggedIn);

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    return { isLoggedIn, logout };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  margin-right: 1.5rem;
  font-weight: 600;
  transition: color 0.2s ease;
}

.nav-link:last-child {
  margin-right: 0;
}

.nav-link:hover {
  color: #3498db;
}

.nav-right {
  display: flex;
  align-items: center;
}

.btn-logout {
  background-color: #e74c3c;
  border: none;
  color: #fff;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-logout:hover {
  background-color: #c0392b;
}
</style>
