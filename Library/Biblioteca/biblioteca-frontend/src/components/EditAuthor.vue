<template>
  <div class="edit-author-container">
    <h2>Editar Autor</h2>
    <form @submit.prevent="handleSubmit" class="edit-author-form">
      <fieldset>
        <label for="nombre">Nombre:</label>
        <input v-model="nombre" id="nombre" required />
      </fieldset>

      <fieldset>
        <label for="biografia">Biografía:</label>
        <textarea v-model="biografia" id="biografia" required></textarea>
      </fieldset>

      <button type="submit">Actualizar Autor</button>
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
    const nombre = ref('');
    const biografia = ref('');

    const authStore = useAuthStore();
    const router = useRouter();

    const fetchAuthor = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/authors/${props.id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        const author = res.data;
        nombre.value = author.nombre;
        biografia.value = author.biografia;
      } catch (error) {
        alert('Error al cargar el autor');
        router.push('/dashboard');
      }
    };

    const handleSubmit = async () => {
      try {
        await axios.put(
          `http://localhost:3000/authors/${props.id}`,
          {
            nombre: nombre.value,
            biografia: biografia.value,
          },
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );
        alert('Autor actualizado con éxito');
        router.push('/dashboard');
      } catch (error) {
        alert('Error al actualizar el autor');
      }
    };

    onMounted(() => {
      fetchAuthor();
    });

    return {
      nombre,
      biografia,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.edit-author-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.edit-author-container h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.edit-author-form fieldset {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  border: none;
  padding: 0;
}

.edit-author-form label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.edit-author-form input,
.edit-author-form textarea {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
}

.edit-author-form button {
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.edit-author-form button:hover {
  background-color: #2980b9;
}
</style>
