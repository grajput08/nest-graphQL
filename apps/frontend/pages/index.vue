<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">
        TaskFlow - Task Manager
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Task List -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-semibold">Tasks</h2>
              <button
                @click="showCreateModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                + New Task
              </button>
            </div>

            <!-- Filter -->
            <div class="mb-4">
              <select
                v-model="selectedStatus"
                class="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">All Tasks</option>
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <!-- Loading State -->
            <div v-if="pending" class="text-center py-8">
              <p class="text-gray-500">Loading tasks...</p>
            </div>

            <!-- Error State -->
            <div
              v-if="error"
              class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
            >
              <p class="text-red-800">Error: {{ error.message }}</p>
            </div>

            <!-- Task List -->
            <div v-if="tasks" class="space-y-3">
              <div
                v-for="task in tasks"
                :key="task.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-semibold text-lg">{{ task.title }}</h3>
                    <p v-if="task.description" class="text-gray-600 mt-1">
                      {{ task.description }}
                    </p>
                    <div class="flex gap-2 mt-2">
                      <span
                        :class="getStatusClass(task.status)"
                        class="px-2 py-1 rounded text-sm font-medium"
                      >
                        {{ task.status }}
                      </span>
                      <span
                        :class="getPriorityClass(task.priority)"
                        class="px-2 py-1 rounded text-sm font-medium"
                      >
                        {{ task.priority }}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="editTask(task)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteTask(task.id)"
                      class="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-if="tasks.length === 0"
                class="text-center py-8 text-gray-500"
              >
                No tasks found. Create your first task!
              </div>
            </div>
          </div>
        </div>

        <!-- Users Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold mb-4">Users</h2>
            <div v-if="usersPending" class="text-gray-500">
              Loading users...
            </div>
            <div v-else-if="usersError" class="text-red-600">
              Error loading users
            </div>
            <div v-else-if="users" class="space-y-2">
              <div
                v-for="user in users"
                :key="user.id"
                class="p-3 border border-gray-200 rounded-lg"
              >
                <p class="font-medium">{{ user.name }}</p>
                <p class="text-sm text-gray-600">{{ user.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div
        v-if="showCreateModal || editingTask"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-2xl font-semibold mb-4">
            {{ editingTask ? 'Edit Task' : 'Create Task' }}
          </h2>
          <form @submit.prevent="editingTask ? updateTask() : createTask()">
            <div class="space-y-4">
              <div>
                <label for="task-title" class="block text-sm font-medium mb-1"
                  >Title</label
                >
                <input
                  id="task-title"
                  v-model="taskForm.title"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label
                  for="task-description"
                  class="block text-sm font-medium mb-1"
                  >Description</label
                >
                <textarea
                  id="task-description"
                  v-model="taskForm.description"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label for="task-status" class="block text-sm font-medium mb-1"
                  >Status</label
                >
                <select
                  id="task-status"
                  v-model="taskForm.status"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div>
                <label
                  for="task-priority"
                  class="block text-sm font-medium mb-1"
                  >Priority</label
                >
                <select
                  id="task-priority"
                  v-model="taskForm.priority"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label for="task-user" class="block text-sm font-medium mb-1"
                  >User</label
                >
                <select
                  id="task-user"
                  v-model="taskForm.userId"
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select a user</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="flex gap-2 mt-6">
              <button
                type="submit"
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {{ editingTask ? 'Update' : 'Create' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_TASKS = gql`
  query GetTasks($status: TaskStatus) {
    getTasks(status: $status) {
      id
      title
      description
      status
      priority
      createdAt
      userId
      user {
        id
        name
        email
      }
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const selectedStatus = ref('');
const showCreateModal = ref(false);
const editingTask = ref(null);

const taskForm = ref({
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  userId: '',
});

const statusFilter = computed(() => selectedStatus.value || null);

const {
  result: tasksResult,
  loading: pending,
  error,
  refetch: refetchTasks,
} = useQuery(GET_TASKS, () => ({ status: statusFilter.value }), {
  fetchPolicy: 'cache-and-network',
});

const tasks = computed(() => tasksResult.value?.getTasks || []);

const {
  result: usersResult,
  loading: usersPending,
  error: usersError,
} = useQuery(GET_USERS);
const users = computed(() => usersResult.value?.getUsers || []);

const { mutate: createTaskMutation } = useMutation(CREATE_TASK);
const { mutate: updateTaskMutation } = useMutation(UPDATE_TASK);
const { mutate: deleteTaskMutation } = useMutation(DELETE_TASK);

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    TODO: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    DONE: 'bg-green-100 text-green-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getPriorityClass = (priority: string) => {
  const classes: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-orange-100 text-orange-800',
    HIGH: 'bg-red-100 text-red-800',
  };
  return classes[priority] || 'bg-gray-100 text-gray-800';
};

const createTask = async () => {
  try {
    await createTaskMutation({ input: taskForm.value });
    closeModal();
    if (refetchTasks) {
      await refetchTasks();
    }
  } catch (err) {
    console.error('Error creating task:', err);
  }
};

const editTask = (task: any) => {
  editingTask.value = task;
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    userId: task.userId,
  };
};

const updateTask = async () => {
  try {
    await updateTaskMutation({
      id: editingTask.value.id,
      input: taskForm.value,
    });
    closeModal();
    if (refetchTasks) {
      await refetchTasks();
    }
  } catch (err) {
    console.error('Error updating task:', err);
  }
};

const deleteTask = async (id: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await deleteTaskMutation({ id });
      if (refetchTasks) {
        await refetchTasks();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingTask.value = null;
  taskForm.value = {
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    userId: '',
  };
};
</script>
