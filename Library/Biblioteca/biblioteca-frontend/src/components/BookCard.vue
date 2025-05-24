<template>
  <div class="book-card">
    <!-- Contenedor de la portada -->
    <div class="cover-container">
      <img
        v-if="coverUrl"
        :src="coverUrl"
        alt="Portada del libro"
        class="cover-image"
      />
      <div v-else class="cover-placeholder">
        Sin portada
      </div>

      <button class="upload-btn" @click="triggerFileInput">
        {{ coverUrl ? 'Cambiar portada' : 'Subir portada' }}
      </button>
      <input
        type="file"
        accept="image/*"
        ref="fileInput"
        @change="onFileChange"
        class="hidden-file-input"
      />
    </div>

    <!-- Datos del libro -->
    <h3>{{ book.titulo || 'Título no disponible' }}</h3>
    <p><strong>Género:</strong> {{ book.genero || 'Sin especificar' }}</p>
    <p>
      <strong>Fecha de Publicación:</strong>
      {{ book.fechaPublicacion || 'Desconocida' }}
    </p>
    <p>
      <strong>Descripción:</strong>
      {{ book.descripcion || 'Sin descripción disponible.' }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      // Si "book" ya trae una URL de portada, úsala; si no, null.
      coverUrl: this.book.portada || null
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      // Crear una URL temporal para mostrar la imagen
      this.coverUrl = URL.createObjectURL(file);
      // Si quieres enviar el archivo al padre para subirlo a un servidor,
      // emite un evento:
      // this.$emit('update:portada', file);
    }
  }
};
</script>

<style scoped>
.book-card {
  max-width: 320px;
  margin: 1rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
}

/* Estilos de portada */
.cover-container {
  position: relative;
  margin-bottom: 1rem;
  text-align: center;
}
.cover-image,
.cover-placeholder {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  background: #f0f0f0;
  line-height: 200px;
  color: #777;
  font-style: italic;
}
.upload-btn {
  margin-top: 0.5rem;
  display: inline-block;
  padding: 0.4rem 1.2rem;
  background: #5a67d8;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.upload-btn:hover {
  background: #434190;
}
/* ocultar input pero dejarlo accesible vía ref */
.hidden-file-input {
  display: none;
}

.book-card h3 {
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  color: #2c3e50;
}
.book-card p {
  margin: 0.25rem 0;
  color: #555;
}
.book-card strong {
  color: #333;
}
</style>