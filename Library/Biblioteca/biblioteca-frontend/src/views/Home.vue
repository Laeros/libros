<template>
  <div class="library-container">
    <header class="header">
      <h1>📚 Biblioteca</h1>

      <nav class="user-menu">
        <div v-if="isLoggedIn" class="logged-in-menu">
          <button @click="handleLogout" class="btn logout-btn">Cerrar Sesión</button>
          <router-link to="/admin" class="btn admin-link">🔧 Panel Admin</router-link>
        </div>

        <div v-else class="guest-menu">
          <router-link to="/login" class="btn login-link">Iniciar Sesión</router-link>
          <span class="separator">|</span>
          <router-link to="/register" class="btn register-link">Registrarse</router-link>
        </div>
      </nav>
    </header>

    <section v-if="isLoggedIn" class="actions-section">
      <button @click="goToAddBook" class="btn action-btn">➕ Añadir Libro</button>
      <button @click="goToAddAuthor" class="btn action-btn">➕ Añadir Autor</button>
    </section>

    <main class="books-section">
      <div v-if="books.length" class="books-grid">
        <BookCard v-for="book in books" :key="book.id" :book="book" />
      </div>
      <p v-else class="no-books-msg">No hay libros disponibles.</p>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import BookCard from '../components/BookCard.vue';
import { useAuthStore } from '../store/auth';

export default {
  components: { BookCard },
  setup() {
    const books = ref([]);
    const authStore = useAuthStore();
    const router = useRouter();

    const isLoggedIn = computed(() => !!authStore.token);

    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/books', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        books.value = response.data;
      } catch (error) {
        console.error('Error al obtener libros:', error);
      }
    };

    const handleLogout = () => {
      authStore.logout();
    };

    const goToAddBook = () => {
      router.push('/books/new');
    };

    const goToAddAuthor = () => {
      router.push('/authors/new');
    };

    onMounted(fetchBooks);

    return {
      books,
      isLoggedIn,
      handleLogout,
      goToAddBook,
      goToAddAuthor,
    };
  },
};
</script>

<style scoped>
.library-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fdfdfd;
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 1rem;
}

.header h1 {
  font-size: 2.8rem;
  color: #42b983;
  margin: 0;
  letter-spacing: 1px;
}

.user-menu {
  margin-top: 0.5rem;
  font-size: 1rem;
}

.user-menu .btn {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  font-weight: 600;
  margin: 0 0.3rem;
  text-decoration: none;
  padding: 0.2rem 0.5rem;
  transition: color 0.3s ease;
  border-radius: 4px;
}

.user-menu .btn:hover {
  color: #2c8b6c;
  background-color: #e0f1e9;
}

.separator {
  margin: 0 0.5rem;
  color: #999;
}

.actions-section {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.action-btn {
  background-color: #42b983;
  border: none;
  color: white;
  font-weight: 700;
  padding: 0.7rem 1.4rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 8px rgb(66 185 131 / 0.3);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.action-btn:hover {
  background-color: #2c8b6c;
  box-shadow: 0 6px 12px rgb(44 139 108 / 0.5);
}

.books-section {
  flex-grow: 1;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.8rem;
}

.no-books-msg {
  font-size: 1.3rem;
  text-align: center;
  color: #777;
  margin-top: 3rem;
  font-style: italic;
}
</style>
