<template>
  <div class="author-form-container">
    <h2>{{ isEdit ? 'Editar Autor' : 'Registrar Nuevo Autor' }}</h2>
    <form class="author-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input
          v-model="nombre"
          id="nombre"
          type="text"
          placeholder="Nombre completo"
          required
        />
      </div>

      <div class="form-group">
        <label for="fechaNacimiento">Fecha de Nacimiento:</label>
        <input
          type="date"
          v-model="fechaNacimiento"
          id="fechaNacimiento"
          required
        />
      </div>

      <div class="form-group">
        <label for="biografia">Biografía:</label>
        <textarea
          v-model="biografia"
          id="biografia"
          rows="5"
          placeholder="Escribe una breve biografía"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label>Libros asignados:</label>
        <div v-if="books.length" class="books-list">
          <div
            v-for="book in books"
            :key="book.id"
            class="checkbox-wrapper"
          >
            <input
              type="checkbox"
              :id="'book-' + book.id"
              :value="book.id"
              v-model="selectedBooks"
            />
            <label :for="'book-' + book.id">{{ book.titulo }}</label>
          </div>
        </div>
        <p v-else class="no-books">No hay libros disponibles para asignar.</p>
      </div>

      <button type="submit" class="submit-btn">
        {{ isEdit ? 'Actualizar Autor' : 'Guardar Autor' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth';

export default {
  setup() {
    const nombre = ref('');
    const fechaNacimiento = ref('');
    const biografia = ref('');
    const books = ref([]);
    const selectedBooks = ref([]);

    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const isEdit = computed(() => !!route.params.id);

    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/books', {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        books.value = res.data;
      } catch (error) {
        console.error('Error al cargar libros:', error);
      }
    };

    const fetchAuthor = async () => {
      if (!isEdit.value) return;
      try {
        const res = await axios.get(`http://localhost:3000/authors/${route.params.id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        const author = res.data;
        nombre.value = author.nombre;
        fechaNacimiento.value = author.fechaNacimiento;
        biografia.value = author.biografia;
        if (author.books && author.books.length) {
          selectedBooks.value = author.books.map(b => (typeof b === 'object' ? b.id : b));
        }
      } catch (error) {
        console.error('Error al cargar autor:', error);
      }
    };

    const handleSubmit = async () => {
      try {
        const payload = {
          nombre: nombre.value,
          fechaNacimiento: fechaNacimiento.value,
          biografia: biografia.value,
          books: selectedBooks.value,
        };
        if (isEdit.value) {
          await axios.put(`http://localhost:3000/authors/${route.params.id}`, payload, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          });
        } else {
          await axios.post('http://localhost:3000/authors', payload, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          });
        }
        alert('Autor guardado con éxito');
        router.push('/dashboard');
      } catch (error) {
        alert('Error al guardar el autor');
        console.error(error);
      }
    };

    onMounted(() => {
      fetchBooks();
      fetchAuthor();
    });

    return {
      nombre,
      fechaNacimiento,
      biografia,
      books,
      selectedBooks,
      isEdit,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.author-form-container {
  max-width: 500px;
  margin: 3rem auto;
  background-color: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.12);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

.author-form-container h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 2rem;
  color: #34495e;
}

.author-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
}

input[type='text'],
input[type='date'],
textarea {
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: 1.7px solid #bdc3c7;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-family: inherit;
  resize: vertical;
}

input[type='text']:focus,
input[type='date']:focus,
textarea:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 6px rgba(52, 152, 219, 0.5);
}

.books-list {
  max-height: 140px;
  overflow-y: auto;
  border: 1px solid #dcdde1;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 0.6rem;
  cursor: pointer;
}

.checkbox-wrapper input[type='checkbox'] {
  margin-right: 0.7rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3498db;
  transition: accent-color 0.3s ease;
}

.checkbox-wrapper input[type='checkbox']:hover {
  accent-color: #2980b9;
}

.no-books {
  font-style: italic;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.9rem 0;
  font-weight: 700;
  font-size: 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1.3rem;
}

.submit-btn:hover {
  background-color: #2980b9;
}
</style>
