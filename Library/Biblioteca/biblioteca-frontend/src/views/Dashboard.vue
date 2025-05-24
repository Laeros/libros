<template>
  <div>
    <h2>Panel de Administración</h2>

    <div class="admin-actions">
      <router-link to="/books/new" class="admin-button">➕ Añadir Libro</router-link>
      <router-link to="/authors/new" class="admin-button">➕ Añadir Autor</router-link>
      <!-- NUEVO BOTÓN PARA GESTIONAR RELACIONES -->
      <router-link to="/author-books" class="admin-button relation-button">🔗 Gestionar Relaciones Autor-Libro</router-link>
    </div>

    <section>
      <h3>Libros</h3>
      <div v-if="books.length">
        <ul>
          <li v-for="book in books" :key="book.id" class="item-row">
            <span>{{ book.titulo }} ({{ book.genero }})</span>
            <div class="actions">
              <router-link :to="`/books/edit/${book.id}`" class="edit-button">✏️ Editar</router-link>
              <button @click="deleteBook(book.id)" class="delete-button">🗑️ Eliminar</button>
              <!-- NUEVO: Botón para ver relaciones del libro -->
              <router-link :to="`/author-books?book=${book.id}`" class="relation-button-small">🔗 Ver Autores</router-link>
            </div>
          </li>
        </ul>
      </div>
      <p v-else>No hay libros disponibles.</p>
    </section>

    <section>
      <h3>Autores</h3>
      <div v-if="authors.length">
        <ul>
          <li v-for="author in authors" :key="author.id" class="item-row">
            <span>{{ author.nombre }}</span>
            <div class="actions">
              <router-link :to="`/authors/edit/${author.id}`" class="edit-button">✏️ Editar</router-link>
              <button @click="deleteAuthor(author.id)" class="delete-button">🗑️ Eliminar</button>
              <!-- NUEVO: Botón para ver relaciones del autor -->
              <router-link :to="`/author-books?author=${author.id}`" class="relation-button-small">🔗 Ver Libros</router-link>
            </div>
          </li>
        </ul>
      </div>
      <p v-else>No hay autores disponibles.</p>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';

export default {
  name: 'Dashboard',
  setup() {
    const books = ref([]);
    const authors = ref([]);
    const authStore = useAuthStore();

    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/books', {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        books.value = res.data;
      } catch (err) {
        console.error('Error al obtener libros:', err);
      }
    };

    const fetchAuthors = async () => {
      try {
        const res = await axios.get('http://localhost:3000/authors', {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        authors.value = res.data;
      } catch (err) {
        console.error('Error al obtener autores:', err);
      }
    };

    const deleteBook = async (id) => {
      if (!confirm('¿Estás seguro que deseas eliminar este libro?')) return;
      try {
        await axios.delete(`http://localhost:3000/books/${id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        books.value = books.value.filter(book => book.id !== id);
      } catch (err) {
        alert('Error al eliminar el libro.');
      }
    };

    const deleteAuthor = async (id) => {
      if (!confirm('¿Estás seguro que deseas eliminar este autor?')) return;
      try {
        await axios.delete(`http://localhost:3000/authors/${id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        authors.value = authors.value.filter(author => author.id !== id);
      } catch (err) {
        alert('Error al eliminar el autor.');
      }
    };

    onMounted(() => {
      fetchBooks();
      fetchAuthors();
    });

    return {
      books,
      authors,
      deleteBook,
      deleteAuthor,
    };
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap; /* Para que se ajuste en pantallas pequeñas */
}

.admin-button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.admin-button:hover {
  background-color: #2c8b6c;
}

/* NUEVO: Estilo especial para el botón de relaciones */
.relation-button {
  background-color: #6c5ce7 !important;
}

.relation-button:hover {
  background-color: #5f4bdb !important;
}

section {
  margin-top: 2rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  border-bottom: 1px solid #ccc;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button {
  background-color: #f0ad4e;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #ec971f;
}

.delete-button {
  background-color: #d9534f;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  color: white;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c9302c;
}

/* NUEVO: Botones pequeños de relación */
.relation-button-small {
  background-color: #6c5ce7;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  color: white;
  text-decoration: none;
  font-size: 0.8rem;
  cursor: pointer;
}

.relation-button-small:hover {
  background-color: #5f4bdb;
}
</style>