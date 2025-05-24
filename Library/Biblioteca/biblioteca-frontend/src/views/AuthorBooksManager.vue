<template>
  <div class="author-books-manager p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Gestión de Relaciones Autor-Libro</h1>
    
    <!-- Sección para ver todas las relaciones -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-700">Todas las Relaciones Autor-Libro</h2>
        <button
          @click="getAllRelations"
          :disabled="loading"
          class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Cargando...' : 'Cargar Relaciones' }}
        </button>
      </div>
      
      <div v-if="allRelations.length > 0" class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID MongoDB
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Autor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Libro
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="relation in allRelations" :key="relation._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {{ relation._id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ relation.idAuthor }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ relation.idBook }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(relation.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="fillUpdateForm(relation)"
                  class="text-orange-600 hover:text-orange-900 bg-orange-100 hover:bg-orange-200 px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  @click="confirmDelete(relation._id)"
                  class="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else-if="!loading && relationsLoaded" class="text-center py-8 text-gray-500">
        <p>No hay relaciones autor-libro registradas.</p>
      </div>
      
      <div v-else-if="!relationsLoaded" class="text-center py-8 text-gray-500">
        <p>Haga clic en "Cargar Relaciones" para ver todas las relaciones existentes.</p>
      </div>
    </div>
    
    <!-- Sección para crear nueva relación -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Crear Nueva Relación</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">ID Autor</label>
          <input
            v-model.number="newRelation.idAuthor"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese ID del autor"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">ID Libro</label>
          <input
            v-model.number="newRelation.idBook"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese ID del libro"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="createRelation"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creando...' : 'Crear Relación' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sección para buscar libros por autor -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Buscar Libros por Autor</h2>
      <div class="flex gap-4 mb-4">
        <input
          v-model.number="searchAuthorId"
          type="number"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="ID del autor"
        />
        <button
          @click="getBooksByAuthor"
          :disabled="loading"
          class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Buscar Libros
        </button>
      </div>
      
      <div v-if="authorBooks.autor" class="mt-4">
        <h3 class="text-lg font-medium text-gray-700 mb-2">
          Libros de: {{ authorBooks.autor.nombre }}
        </h3>
        <div v-if="authorBooks.libros.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="libro in authorBooks.libros"
            :key="libro.id"
            class="bg-gray-100 p-4 rounded-md"
          >
            <p class="font-medium">{{ libro.titulo }}</p>
            <p class="text-sm text-gray-600">ID: {{ libro.id }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">Este autor no tiene libros asociados.</p>
      </div>
    </div>

    <!-- Sección para buscar autores por libro -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Buscar Autores por Libro</h2>
      <div class="flex gap-4 mb-4">
        <input
          v-model.number="searchBookId"
          type="number"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="ID del libro"
        />
        <button
          @click="getAuthorsByBook"
          :disabled="loading"
          class="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          Buscar Autores
        </button>
      </div>
      
      <div v-if="bookAuthors.libro" class="mt-4">
        <h3 class="text-lg font-medium text-gray-700 mb-2">
          Autores de: {{ bookAuthors.libro.titulo }}
        </h3>
        <div v-if="bookAuthors.autores.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="autor in bookAuthors.autores"
            :key="autor.id"
            class="bg-gray-100 p-4 rounded-md"
          >
            <p class="font-medium">{{ autor.nombre }}</p>
            <p class="text-sm text-gray-600">ID: {{ autor.id }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">Este libro no tiene autores asociados.</p>
      </div>
    </div>

    <!-- Sección para actualizar relación -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Actualizar Relación</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">ID MongoDB Relación</label>
          <input
            v-model="updateRelation.id"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="ID de la relación"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">Nuevo ID Autor</label>
          <input
            v-model.number="updateRelation.idAuthor"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Nuevo ID autor"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">Nuevo ID Libro</label>
          <input
            v-model.number="updateRelation.idBook"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Nuevo ID libro"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="updateRelationHandler"
            :disabled="loading"
            class="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            {{ loading ? 'Actualizando...' : 'Actualizar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sección para eliminar relación -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Eliminar Relación</h2>
      <div class="flex gap-4">
        <input
          v-model="deleteRelationId"
          type="text"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="ID MongoDB de la relación a eliminar"
        />
        <button
          @click="deleteRelation"
          :disabled="loading"
          class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {{ loading ? 'Eliminando...' : 'Eliminar Relación' }}
        </button>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="message" class="fixed bottom-4 right-4" :class="messageClass">
      <div class="px-4 py-3 rounded-md shadow-lg">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AuthorBooksManager',
  data() {
    return {
      loading: false,
      message: '',
      messageType: 'success',
      
      // Para ver todas las relaciones
      allRelations: [],
      relationsLoaded: false,
      
      // Para crear nueva relación
      newRelation: {
        idAuthor: null,
        idBook: null
      },
      
      // Para buscar libros por autor
      searchAuthorId: null,
      authorBooks: {
        autor: null,
        libros: []
      },
      
      // Para buscar autores por libro
      searchBookId: null,
      bookAuthors: {
        libro: null,
        autores: []
      },
      
      // Para actualizar relación
      updateRelation: {
        id: '',
        idAuthor: null,
        idBook: null
      },
      
      // Para eliminar relación
      deleteRelationId: ''
    }
  },
  
  computed: {
    messageClass() {
      const baseClass = 'transition-all duration-300 z-50'
      return this.messageType === 'success' 
        ? `${baseClass} bg-green-500 text-white`
        : `${baseClass} bg-red-500 text-white`
    }
  },
  
  mounted() {
    // Verificar si hay parámetros en la URL para cargar datos automáticamente
    const urlParams = new URLSearchParams(window.location.search)
    const authorParam = urlParams.get('author')
    const bookParam = urlParams.get('book')
    
    if (authorParam) {
      this.searchAuthorId = parseInt(authorParam)
      this.getBooksByAuthor()
    }
    
    if (bookParam) {
      this.searchBookId = parseInt(bookParam)
      this.getAuthorsByBook()
    }
    
    // Cargar todas las relaciones al iniciar
    this.getAllRelations()
  },
  
  methods: {
    // Configurar headers con token de autenticación
    getAuthHeaders() {
      // Usar el mismo store de auth que tienes en Dashboard
      const authStore = this.$store?.state?.auth || { token: localStorage.getItem('token') }
      return {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        }
      }
    },
    
    // Mostrar mensaje temporal
    showMessage(msg, type = 'success') {
      this.message = msg
      this.messageType = type
      setTimeout(() => {
        this.message = ''
      }, 4000)
    },
    
    // Formatear fecha
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    // Obtener todas las relaciones
    async getAllRelations() {
      this.loading = true
      try {
        const response = await axios.get(
          'http://localhost:3000/author-books',
          this.getAuthHeaders()
        )
        
        this.allRelations = response.data
        this.relationsLoaded = true
      } catch (error) {
        this.showMessage(
          error.response?.data?.mensaje || 'Error al cargar las relaciones',
          'error'
        )
        this.allRelations = []
      } finally {
        this.loading = false
      }
    },
    
    // Llenar formulario de actualización desde la tabla
    fillUpdateForm(relation) {
      this.updateRelation = {
        id: relation._id,
        idAuthor: relation.idAuthor,
        idBook: relation.idBook
      }
      
      // Scroll suave hacia la sección de actualización
      const updateSection = document.querySelector('.bg-white:nth-of-type(5)')
      if (updateSection) {
        updateSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    
    // Confirmar eliminación desde la tabla
    confirmDelete(relationId) {
      if (confirm('¿Está seguro de que desea eliminar esta relación?')) {
        this.deleteRelationId = relationId
        this.deleteRelation()
      }
    },
    
    // Crear nueva relación autor-libro
    async createRelation() {
      if (!this.newRelation.idAuthor || !this.newRelation.idBook) {
        this.showMessage('Por favor, complete todos los campos', 'error')
        return
      }
      
      this.loading = true
      try {
        const response = await axios.post(
          'http://localhost:3000/author-books',
          this.newRelation,
          this.getAuthHeaders()
        )
        
        this.showMessage(response.data.mensaje)
        this.newRelation = { idAuthor: null, idBook: null }
        
        // Recargar la lista de relaciones
        this.getAllRelations()
      } catch (error) {
        this.showMessage(
          error.response?.data?.mensaje || 'Error al crear la relación',
          'error'
        )
      } finally {
        this.loading = false
      }
    },
    
    // Obtener libros de un autor
    async getBooksByAuthor() {
      if (!this.searchAuthorId) {
        this.showMessage('Por favor, ingrese el ID del autor', 'error')
        return
      }
      
      this.loading = true
      try {
        const response = await axios.get(
          `http://localhost:3000/author-books/author/${this.searchAuthorId}`,
          this.getAuthHeaders()
        )
        
        this.authorBooks = response.data
      } catch (error) {
        this.showMessage(
          error.response?.data?.mensaje || 'Error al buscar libros del autor',
          'error'
        )
        this.authorBooks = { autor: null, libros: [] }
      } finally {
        this.loading = false
      }
    },
    
    // Obtener autores de un libro
    async getAuthorsByBook() {
      if (!this.searchBookId) {
        this.showMessage('Por favor, ingrese el ID del libro', 'error')
        return
      }
      
      this.loading = true
      try {
        const response = await axios.get(
          `http://localhost:3000/author-books/book/${this.searchBookId}`,
          this.getAuthHeaders()
        )
        
        this.bookAuthors = response.data
      } catch (error) {
        this.showMessage(
          error.response?.data?.mensaje || 'Error al buscar autores del libro',
          'error'
        )
        this.bookAuthors = { libro: null, autores: [] }
      } finally {
        this.loading = false
      }
    },
    
    // Actualizar relación
    async updateRelationHandler() {
      if (!this.updateRelation.id || !this.updateRelation.idAuthor || !this.updateRelation.idBook) {
        this.showMessage('Por favor, complete todos los campos para actualizar', 'error')
        return
      }
      
      this.loading = true
      try {
        const response = await axios.put(
          `http://localhost:3000/author-books/${this.updateRelation.id}`,
          {
            idAuthor: this.updateRelation.idAuthor,
            idBook: this.updateRelation.idBook
          },
          this.getAuthHeaders()
        )
        
        this.showMessage(response.data.mensaje)
        this.updateRelation = { id: '', idAuthor: null, idBook: null }
        
        // Recargar la lista de relaciones
        this.getAllRelations()
      } catch (error) {
        this.showMessage(
          error.response?.data?.mensaje || 'Error al actualizar la relación',
          'error'
        )
      } finally {
        this.loading = false
      }
    },
    
    // Eliminar relación
    async deleteRelation() {
      if (!this.deleteRelationId) {
        this.showMessage('Por favor, ingrese el ID de la relación a eliminar', 'error')
        return
      }
      
      if (!confirm('¿Está seguro de que desea eliminar esta relación?')) {
        return
      }
      
      this.loading = true
      try {
        const response = await axios.delete(
          `http://localhost:3000/author-books/${this.deleteRelationId}`,
          this.getAuthHeaders()
        )
        
        this.showMessage(response.data.mensaje)
        this.deleteRelationId = ''
        
        // Recargar la lista de relaciones
        this.getAllRelations()
      } catch (error) {
        this.showMessage(
          error.response?.data?.mensaje || 'Error al eliminar la relación',
          'error'
        )
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.author-books-manager {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f9fafb;
  color: #374151;
}

/* Contenedores */
.bg-white {
  transition: box-shadow 0.4s ease, transform 0.3s ease;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.05);
  border-radius: 0.75rem; /* 12px */
}

.bg-white:hover {
  box-shadow: 0 12px 24px rgb(0 0 0 / 0.15);
  transform: translateY(-4px);
}

/* Botones */
button {
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  border-radius: 0.5rem;
  will-change: transform;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgb(0 0 0 / 0.15);
}

button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
}

/* Botones de acción específicos */
.bg-indigo-600:hover {
  background-color: #4f46e5;
}

.bg-blue-600:hover {
  background-color: #2563eb;
}

.bg-green-600:hover {
  background-color: #16a34a;
}

.bg-purple-600:hover {
  background-color: #6d28d9;
}

.bg-orange-600:hover {
  background-color: #ea580c;
}

.bg-red-600:hover {
  background-color: #dc2626;
}

/* Inputs */
input {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  outline: none;
}

/* Table */
table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 0.75rem;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.05);
}

thead tr {
  background-color: #f3f4f6;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #6b7280;
  letter-spacing: 0.05em;
}

tbody tr {
  transition: background-color 0.25s ease;
  cursor: default;
}

tbody tr:hover {
  background-color: #eef2ff;
}

/* Scrollable table wrapper */
.overflow-x-auto {
  border-radius: 0.75rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: inset 0 0 8px rgb(0 0 0 / 0.05);
}

/* Mensajes flotantes */
.fixed.bottom-4.right-4 {
  z-index: 1000;
  max-width: 320px;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideInUp 0.4s ease forwards;
}

.fixed.bottom-4.right-4.bg-green-500 {
  background-color: #22c55e;
  color: #f9fafb;
}

.fixed.bottom-4.right-4.bg-red-500 {
  background-color: #ef4444;
  color: #f9fafb;
}

/* Iconos para mensajes */
.fixed.bottom-4.right-4::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
}

.fixed.bottom-4.right-4.bg-green-500::before {
  background-image: url("data:image/svg+xml,%3csvg fill='none' stroke='white' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'%3e%3c/path%3e%3c/svg%3e");
}

.fixed.bottom-4.right-4.bg-red-500::before {
  background-image: url("data:image/svg+xml,%3csvg fill='none' stroke='white' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12'%3e%3c/path%3e%3c/svg%3e");
}

/* Animación para mensajes */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Espaciados y tipografía */
h1, h2, h3 {
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.02em;
}

h2 {
  font-weight: 700;
  color: #334155;
}

h3 {
  font-weight: 600;
  color: #475569;
}

/* Grid cards para libros y autores */
.grid > div {
  transition: background-color 0.3s ease, transform 0.3s ease;
  cursor: default;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
  background-color: #f3f4f6;
}

.grid > div:hover {
  background-color: #e0e7ff;
  transform: translateY(-4px);
}

/* Mejorar input placeholders */
input::placeholder {
  color: #9ca3af;
  font-style: italic;
}

/* Mejorar focus states para accesibilidad */
input:focus-visible, button:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

/* Scroll horizontal para tablas en móviles */
@media (max-width: 768px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}

/* Font monospace para IDs */
.font-mono {
  font-family: 'Fira Code', 'Courier New', monospace;
}

/* Cursor disabled */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}

/* Ajuste para el espacio entre botones de acción */
.space-x-2 > * + * {
  margin-left: 0.5rem;
}
</style>