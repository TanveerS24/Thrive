// API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Auth APIs
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  logout: async () => {
    await fetch(`${API_BASE_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },
};

// Goal APIs
export const goalAPI = {
  // Get all goals for a user
  getUserGoals: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/goal/user/${userId}`, {
      credentials: 'include',
    });
    return response.json();
  },

  // Get goal status
  getGoalStatus: async (goalId: string) => {
    const response = await fetch(`${API_BASE_URL}/goal/status/${goalId}`, {
      credentials: 'include',
    });
    return response.json();
  },

  // Create a new goal with tasks
  createGoal: async (userId: string, title: string, description: string, tasks: any[]) => {
    const response = await fetch(`${API_BASE_URL}/goal/create/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, description, tasks }),
    });
    return response.json();
  },

  // Add task to goal
  addTask: async (goalId: string, name: string, targetDays: number) => {
    const response = await fetch(`${API_BASE_URL}/goal/add-task/${goalId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, targetDays }),
    });
    return response.json();
  },

  // Edit goal
  editGoal: async (goalId: string, title: string, description: string, tasks: any[]) => {
    const response = await fetch(`${API_BASE_URL}/goal/edit/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, description, tasks }),
    });
    return response.json();
  },

  // Toggle task completion
  toggleTaskCompletion: async (goalStatusId: string, taskId: string, date: string) => {
    const response = await fetch(
      `${API_BASE_URL}/goal/toggle-completed/${goalStatusId}/${taskId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ date }),
      }
    );
    return response.json();
  },

  // Delete task
  deleteTask: async (goalId: string, taskId: string) => {
    const response = await fetch(`${API_BASE_URL}/goal/delete-task/${goalId}/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.json();
  },

  // Delete goal
  deleteGoal: async (goalId: string) => {
    const response = await fetch(`${API_BASE_URL}/goal/${goalId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },
};
