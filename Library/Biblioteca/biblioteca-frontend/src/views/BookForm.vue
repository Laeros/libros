<template>
  <div class="form-container">
    <h2>{{ isEdit ? 'Editar Libro' : 'Registrar Nuevo Libro' }}</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="titulo">Título:</label>
        <input v-model="titulo" id="titulo" required />
      </div>
      <div class="form-group">
        <label for="genero">Género:</label>
        <input v-model="genero" id="genero" required />
      </div>
      <div class="form-group">
        <label for="fechaPublicacion">Fecha de Publicación:</label>
        <input type="date" v-model="fechaPublicacion" id="fechaPublicacion" required />
      </div>
      <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea v-model="descripcion" id="descripcion" required></textarea>
      </div>
      <div class="form-group">
        <label>Autores asignados:</label>
        <div v-if="authors.length" class="checkbox-group">
          <div v-for="author in authors" :key="author.id" class="checkbox-item">
            <input
              type="checkbox"
              :id="'author-' + author.id"
              :value="author.id"
              v-model="selectedAuthors"
            />
            <label :for="'author-' + author.id">{{ author.nombre }}</label>
          </div>
        </div>
        <p v-else class="no-assign">No hay autores disponibles para asignar.</p>
      </div>
      <button type="submit" class="btn-submit">{{ isEdit ? 'Actualizar Libro' : 'Guardar Libro' }}</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

export default {
  setup() {
    const titulo = ref('');
    const genero = ref('');
    const fechaPublicacion = ref('');
    const descripcion = ref('');
    const authors = ref([]);
    const selectedAuthors = ref([]);

    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const isEdit = computed(() => !!route.params.id);

    const fetchAuthors = async () => {
      try {
        const res = await axios.get('http://localhost:3000/authors', {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        authors.value = res.data;
      } catch (error) {
        console.error('Error al cargar autores:', error);
      }
    };

    const fetchBook = async () => {
      if (!isEdit.value) return;
      try {
        const res = await axios.get(`http://localhost:3000/books/${route.params.id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        const book = res.data;
        titulo.value = book.titulo;
        genero.value = book.genero;
        fechaPublicacion.value = book.fechaPublicacion;
        descripcion.value = book.descripcion;
        if (book.authors && book.authors.length) {
          selectedAuthors.value = book.authors.map(a => (typeof a === 'object' ? a.id : a));
        }
      } catch (error) {
        console.error('Error al cargar libro:', error);
      }
    };

    const handleSubmit = async () => {
      try {
        const payload = {
          titulo: titulo.value,
          genero: genero.value,
          fechaPublicacion: fechaPublicacion.value,
          descripcion: descripcion.value,
          authors: selectedAuthors.value,
        };

        if (isEdit.value) {
          await axios.put(`http://localhost:3000/books/${route.params.id}`, payload, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          });
        } else {
          await axios.post('http://localhost:3000/books', payload, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          });
        }
        alert('Libro guardado con éxito');
        router.push('/dashboard');
      } catch (error) {
        alert('Error al guardar el libro');
        console.error(error);
      }
    };

    onMounted(() => {
      fetchAuthors();
      fetchBook();
    });

    return {
      titulo,
      genero,
      fechaPublicacion,
      descripcion,
      authors,
      selectedAuthors,
      isEdit,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem 2.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 700;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
  user-select: none;
}

input[type="text"],
input[type="date"] {
  height: 2.8rem;           
  padding: 0.6rem 0.75rem;
  font-size: 1.05rem;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6; /* azul */
  box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
}

textarea {
  min-height: 130px;         /* un poco más alto para comodidad */
  padding: 0.8rem 0.75rem;
  font-size: 1.05rem;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 7px rgba(59, 130, 246, 0.6);
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-height: 160px;
  overflow-y: auto;
  padding: 0.5rem 0.5rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: #444;
  user-select: none;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 4px;
  border: 1.5px solid #ccc;
  transition: border-color 0.3s ease;
}

input[type="checkbox"]:checked {
  border-color: #3b82f6;
  background-color: #3b82f6;
}

.no-assign {
  color: #999;
  font-style: italic;
  margin-top: 0.4rem;
  user-select: none;
}

.btn-submit {
  padding: 0.85rem 2rem;
  font-size: 1.15rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  align-self: center;
  transition: background-color 0.3s ease;
  width: 50%;
  font-weight: 600;
  box-shadow: 0 4px 8px rgb(59 130 246 / 0.4);
}

.btn-submit:hover {
  background-color: #2563eb;
  box-shadow: 0 6px 12px rgb(37 99 235 / 0.6);
}

</style>