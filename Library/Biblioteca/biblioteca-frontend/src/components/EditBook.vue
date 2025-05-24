<template>
  <div class="edit-book-container">
    <h2>Editar Libro</h2>
    <form @submit.prevent="handleSubmit" class="edit-book-form">
      <fieldset>
        <label for="titulo">Título:</label>
        <input v-model="titulo" id="titulo" required />
      </fieldset>

      <fieldset>
        <label for="genero">Género:</label>
        <input v-model="genero" id="genero" required />
      </fieldset>

      <fieldset>
        <label for="fechaPublicacion">Fecha de Publicación:</label>
        <input type="date" v-model="fechaPublicacion" id="fechaPublicacion" required />
      </fieldset>

      <fieldset>
        <label for="descripcion">Descripción:</label>
        <textarea v-model="descripcion" id="descripcion" required></textarea>
      </fieldset>

      <button type="submit">Actualizar Libro</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const titulo = ref('');
    const genero = ref('');
    const fechaPublicacion = ref('');
    const descripcion = ref('');

    const authStore = useAuthStore();
    const router = useRouter();

    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/books/${props.id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        const book = res.data;
        titulo.value = book.titulo;
        genero.value = book.genero;
        fechaPublicacion.value = book.fechaPublicacion;
        descripcion.value = book.descripcion;
      } catch (error) {
        alert('Error al cargar el libro');
        router.push('/dashboard');
      }
    };

    const handleSubmit = async () => {
      try {
        await axios.put(
          `http://localhost:3000/books/${props.id}`,
          {
            titulo: titulo.value,
            genero: genero.value,
            fechaPublicacion: fechaPublicacion.value,
            descripcion: descripcion.value,
          },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        alert('Libro actualizado con éxito');
        router.push('/dashboard');
      } catch (error) {
        alert('Error al actualizar el libro');
      }
    };

    onMounted(() => {
      fetchBook();
    });

    return {
      titulo,
      genero,
      fechaPublicacion,
      descripcion,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.edit-book-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.edit-book-container h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.edit-book-form fieldset {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  border: none;
  padding: 0;
}

.edit-book-form label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.edit-book-form input,
.edit-book-form textarea {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
}

.edit-book-form button {
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.edit-book-form button:hover {
  background-color: #2980b9;
}
</style>
