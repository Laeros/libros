<template>
  <div class="user-profile">
    <h2 v-if="userId">Perfil de Usuario: {{ userId }}</h2>
    <h2 v-else>Gestión de Usuarios</h2>

    <!-- Mostrar datos individuales si viene el ID -->
    <div v-if="userId && singleUser">
      <p><strong>ID:</strong> {{ singleUser.id }}</p>
      <p><strong>Usuario:</strong> {{ singleUser.username }}</p>
    </div>

    <!-- Formulario para crear/editar usuario -->
    <form v-if="!userId" @submit.prevent="onSubmit">
      <div>
        <label for="username">Usuario</label>
        <input id="username" v-model="form.username" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input
          id="password"
          type="password"
          v-model="form.password"
          :required="!editMode"
          placeholder="Ingrese contraseña"
        />
      </div>
      <button type="submit">{{ editMode ? "Actualizar" : "Crear" }}</button>
      <button v-if="editMode" type="button" @click="cancelEdit">Cancelar</button>
    </form>

    <hr v-if="!userId" />

    <!-- Lista de usuarios -->
    <div v-if="!userId">
      <h3>Usuarios registrados</h3>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>
              <button @click="startEdit(user)">Editar</button>
              <button @click="deleteUser(user.id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="3">No hay usuarios.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensajes -->
    <p v-if="message" :class="{ error: isError }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const API_URL = "http://localhost:3000/users";

const route = useRoute();
const userId = route.params.userId;

const users = ref([]);
const singleUser = ref(null);
const message = ref("");
const isError = ref(false);

const form = ref({
  id: null,
  username: "",
  password: "",
});

const editMode = ref(false);

const showMessage = (msg, error = false) => {
  message.value = msg;
  isError.value = error;
  setTimeout(() => {
    message.value = "";
  }, 3000);
};

const fetchUsers = async () => {
  try {
    console.log("Fetch all users");
    const res = await axios.get(API_URL);
    users.value = res.data;
    console.log("Usuarios obtenidos:", users.value);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    showMessage("Error al obtener usuarios: " + err.message, true);
  }
};

const fetchSingleUser = async (id) => {
  if (!id) {
    showMessage("ID de usuario no proporcionado", true);
    console.warn("fetchSingleUser: id inválido", id);
    return;
  }

  try {
    console.log("Fetch single user con ID:", id);
    const res = await axios.get(`${API_URL}/${id}`);
    if (res.data && Object.keys(res.data).length > 0) {
      singleUser.value = res.data;
      console.log("Usuario obtenido:", singleUser.value);
      showMessage("Perfil cargado correctamente");
    } else {
      singleUser.value = null;
      showMessage("Usuario no encontrado", true);
      console.warn("fetchSingleUser: usuario no encontrado en respuesta", res.data);
    }
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    showMessage("Error al obtener usuario: " + err.message, true);
  }
};

const onSubmit = async () => {
  if (!form.value.username.trim()) {
    showMessage("El nombre de usuario es obligatorio", true);
    return;
  }
  if (!editMode.value && !form.value.password.trim()) {
    showMessage("La contraseña es obligatoria al crear un usuario", true);
    return;
  }

  if (editMode.value) {
    try {
      const updateData = { username: form.value.username };
      if (form.value.password.trim() !== "") {
        updateData.password = form.value.password;
      }
      await axios.put(`${API_URL}/${form.value.id}`, updateData);
      showMessage("Usuario actualizado correctamente");
      cancelEdit();
      fetchUsers();
    } catch (err) {
      showMessage("Error al actualizar usuario: " + err.response?.data?.error || err.message, true);
    }
  } else {
    try {
      await axios.post(API_URL, {
        username: form.value.username,
        password: form.value.password,
      });
      showMessage("Usuario creado correctamente");
      form.value.username = "";
      form.value.password = "";
      fetchUsers();
    } catch (err) {
      showMessage("Error al crear usuario: " + err.response?.data?.error || err.message, true);
    }
  }
};

const startEdit = (user) => {
  form.value.id = user.id;
  form.value.username = user.username;
  form.value.password = "";
  editMode.value = true;
};

const cancelEdit = () => {
  form.value.id = null;
  form.value.username = "";
  form.value.password = "";
  editMode.value = false;
};

const deleteUser = async (id) => {
  if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

  try {
    await axios.delete(`${API_URL}/${id}`);
    showMessage("Usuario eliminado correctamente");
    fetchUsers();
  } catch (err) {
    showMessage("Error al eliminar usuario: " + err.response?.data?.error || err.message, true);
  }
};

onMounted(() => {
  console.log("Mounted, userId:", userId);
  if (userId) {
    fetchSingleUser(userId);
  } else {
    fetchUsers();
  }
});

watch(() => route.params.userId, (newId) => {
  console.log("watch: cambio de userId:", newId);
  if (newId) {
    fetchSingleUser(newId);
  } else {
    singleUser.value = null;
    fetchUsers();
  }
});
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

form > div {
  margin-bottom: 10px;
}

input {
  padding: 6px;
  width: 100%;
  box-sizing: border-box;
}

button {
  margin-right: 10px;
  padding: 6px 12px;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
