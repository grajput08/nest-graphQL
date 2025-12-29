<template>
  <div class="min-h-screen bg-slate-50">
    <div class="container mx-auto px-4 py-6 max-w-6xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-light text-slate-800 mb-2">Tasks</h1>
        <p class="text-sm text-slate-500">Manage your tasks and assignments</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Task List -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded border border-slate-200">
            <!-- Header Actions -->
            <div
              class="p-4 border-b border-slate-200 flex justify-between items-center"
            >
              <div class="flex items-center gap-3">
                <select
                  v-model="selectedStatus"
                  class="text-sm border border-slate-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="">All Tasks</option>
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <button
                @click="showCreateModal = true"
                class="text-sm px-4 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors"
              >
                + New Task
              </button>
            </div>

            <!-- Content -->
            <div class="p-4">
              <!-- Loading State -->
              <div v-if="pending" class="text-center py-12">
                <p class="text-sm text-slate-400">Loading tasks...</p>
              </div>

              <!-- Error State -->
              <div
                v-if="error"
                class="bg-red-50 border border-red-200 rounded p-3 mb-4"
              >
                <p class="text-sm text-red-700">Error: {{ error.message }}</p>
              </div>

              <!-- Task List -->
              <div v-if="tasks && !pending" class="space-y-2">
                <div
                  v-for="task in tasks"
                  :key="task.id"
                  class="border border-slate-200 rounded p-4 hover:border-slate-300 transition-colors"
                >
                  <div class="flex justify-between items-start gap-4">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium text-slate-900 mb-1">
                        {{ task.title }}
                      </h3>
                      <p
                        v-if="task.description"
                        class="text-sm text-slate-600 mb-3 line-clamp-2"
                      >
                        {{ task.description }}
                      </p>
                      <div class="flex gap-2 flex-wrap">
                        <span
                          :class="getStatusClass(task.status)"
                          class="text-xs px-2 py-0.5 rounded font-medium"
                        >
                          {{ task.status }}
                        </span>
                        <span
                          :class="getPriorityClass(task.priority)"
                          class="text-xs px-2 py-0.5 rounded font-medium"
                        >
                          {{ task.priority }}
                        </span>
                      </div>
                    </div>
                    <div class="flex gap-2 shrink-0">
                      <button
                        @click="editTask(task)"
                        class="text-xs text-slate-600 hover:text-slate-900 px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteTask(task.id)"
                        class="text-xs text-red-600 hover:text-red-800 px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  v-if="tasks.length === 0"
                  class="text-center py-12 text-slate-400"
                >
                  <p class="text-sm">No tasks found. Create your first task!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded border border-slate-200">
            <div class="p-4 border-b border-slate-200">
              <h2 class="text-sm font-medium text-slate-900">Users</h2>
            </div>
            <div class="p-4">
              <div v-if="usersPending" class="text-sm text-slate-400 py-4">
                Loading users...
              </div>
              <div v-else-if="usersError" class="text-sm text-red-600 py-4">
                Error loading users
              </div>
              <div v-else-if="users" class="space-y-2">
                <div
                  v-for="user in users"
                  :key="user.id"
                  class="p-3 border border-slate-200 rounded"
                >
                  <p class="text-sm font-medium text-slate-900">
                    {{ user.name }}
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ user.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div
        v-if="showCreateModal || editingTask"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded border border-slate-200 w-full max-w-md shadow-lg"
        >
          <div class="p-5 border-b border-slate-200">
            <h2 class="text-lg font-medium text-slate-900">
              {{ editingTask ? 'Edit Task' : 'Create Task' }}
            </h2>
          </div>
          <form @submit.prevent="editingTask ? updateTask() : createTask()">
            <div class="p-5 space-y-4">
              <div>
                <label
                  for="task-title"
                  class="block text-xs font-medium text-slate-700 mb-1.5"
                  >Title</label
                >
                <input
                  id="task-title"
                  v-model="taskForm.title"
                  type="text"
                  required
                  class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
              <div>
                <label
                  for="task-description"
                  class="block text-xs font-medium text-slate-700 mb-1.5"
                  >Description</label
                >
                <textarea
                  id="task-description"
                  v-model="taskForm.description"
                  class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label
                  for="task-status"
                  class="block text-xs font-medium text-slate-700 mb-1.5"
                  >Status</label
                >
                <select
                  id="task-status"
                  v-model="taskForm.status"
                  class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div>
                <label
                  for="task-priority"
                  class="block text-xs font-medium text-slate-700 mb-1.5"
                  >Priority</label
                >
                <select
                  id="task-priority"
                  v-model="taskForm.priority"
                  class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label
                  for="task-user"
                  class="block text-xs font-medium text-slate-700 mb-1.5"
                  >User</label
                >
                <select
                  id="task-user"
                  v-model="taskForm.userId"
                  required
                  class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  :disabled="usersPending"
                >
                  <option value="">
                    {{ usersPending ? 'Loading users...' : 'Select a user' }}
                  </option>
                  <option
                    v-if="users && users.length > 0"
                    v-for="user in users"
                    :key="user.id"
                    :value="user.id"
                  >
                    {{ user.name }}
                  </option>
                </select>
                <p v-if="usersError" class="text-xs text-red-600 mt-1">
                  Error loading users
                </p>
                <p
                  v-if="!usersPending && !usersError && users.length === 0"
                  class="text-xs text-slate-500 mt-1"
                >
                  No users available
                </p>
              </div>
            </div>
            <div class="p-5 border-t border-slate-200 flex gap-2">
              <button
                type="submit"
                class="flex-1 bg-slate-900 text-white px-4 py-2 rounded text-sm hover:bg-slate-800 transition-colors"
              >
                {{ editingTask ? 'Update' : 'Create' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded text-sm hover:bg-slate-200 transition-colors"
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
  refetch: refetchUsers,
} = useQuery(GET_USERS, null, {
  fetchPolicy: 'cache-and-network',
});
const users = computed(() => {
  if (usersResult.value?.getUsers) {
    return usersResult.value.getUsers;
  }
  return [];
});

const { mutate: createTaskMutation } = useMutation(CREATE_TASK);
const { mutate: updateTaskMutation } = useMutation(UPDATE_TASK);
const { mutate: deleteTaskMutation } = useMutation(DELETE_TASK);

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    TODO: 'bg-amber-50 text-amber-700 border border-amber-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border border-blue-200',
    DONE: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };
  return (
    classes[status] || 'bg-slate-50 text-slate-700 border border-slate-200'
  );
};

const getPriorityClass = (priority: string) => {
  const classes: Record<string, string> = {
    LOW: 'bg-slate-50 text-slate-700 border border-slate-200',
    MEDIUM: 'bg-orange-50 text-orange-700 border border-orange-200',
    HIGH: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    classes[priority] || 'bg-slate-50 text-slate-700 border border-slate-200'
  );
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
