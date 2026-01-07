import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { goalAPI } from '../services/api';
import TaskRow from '../components/TaskRow';
import TitleDropdown from '../components/TitleDropdown';
import AddTaskModal from '../components/AddTaskModal';
import CreateCollectionModal from '../components/CreateCollectionModal';

interface Task {
  _id: string;
  name: string;
  targetDays: number;
}

interface Goal {
  _id: string;
  title: string;
  description: string;
  tasks: Task[];
}

interface GoalStatus {
  _id: string;
  completedTasks: Array<{
    taskId: string;
    completedDays: string[];
  }>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userId, username, logout } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goalStatus, setGoalStatus] = useState<GoalStatus | null>(null);
  const [visibleTasks, setVisibleTasks] = useState<Set<string>>(new Set());
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isCreateCollectionModalOpen, setIsCreateCollectionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateTimeouts, setUpdateTimeouts] = useState<{ [key: string]: ReturnType<typeof setTimeout> }>({});
  const [showHiddenTasks, setShowHiddenTasks] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchGoals();
  }, [isLoggedIn, navigate]);

  const fetchGoals = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const data = await goalAPI.getUserGoals(userId);

      if (Array.isArray(data)) {
        setGoals(data);
        if (data.length > 0) {
          setSelectedGoalId(data[0]._id);
          fetchGoalStatus(data[0]._id);
          setVisibleTasks(new Set(data[0].tasks.map((t: Task) => t._id)));
        }
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoalStatus = async (goalId: string) => {
    try {
      const data = await goalAPI.getGoalStatus(goalId);
      setGoalStatus(data);
    } catch (error) {
      console.error('Error fetching goal status:', error);
    }
  };

  const handleSelectGoal = (goalId: string): void => {
    setSelectedGoalId(goalId);
    const goal = goals.find((g: Goal) => g._id === goalId);
    if (goal) {
      setVisibleTasks(new Set(goal.tasks.map((t) => t._id)));
      fetchGoalStatus(goalId);
    }
  };

  const handleToggleTaskDay = (taskId: string) => {
    if (!goalStatus || !selectedGoalId) return;

    // Clear existing timeout if any
    if (updateTimeouts[taskId]) {
      clearTimeout(updateTimeouts[taskId]);
    }

    // Set new timeout for 2 seconds
    const timeout = setTimeout(async () => {
      try {
        await goalAPI.toggleTaskCompletion(goalStatus._id, taskId);
        fetchGoalStatus(selectedGoalId);
      } catch (error) {
        console.error('Error toggling task completion:', error);
      }
    }, 2000);

    setUpdateTimeouts({
      ...updateTimeouts,
      [taskId]: timeout,
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!selectedGoalId) return;
    try {
      await goalAPI.deleteTask(selectedGoalId, taskId);
      fetchGoals();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleHideTask = (taskId: string) => {
    const newVisible = new Set(visibleTasks);
    newVisible.delete(taskId);
    setVisibleTasks(newVisible);
  };

  const handleAddTask = async (name: string, targetDays: number) => {
    if (!selectedGoalId) return;
    try {
      await goalAPI.addTask(selectedGoalId, name, targetDays);
      fetchGoals();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCreateCollection = async (title: string, description: string, tasks: any[]) => {
    if (!userId) return;
    try {
      await goalAPI.createGoal(userId, title, description, tasks);
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await goalAPI.deleteGoal(goalId);
      fetchGoals();
      if (selectedGoalId === goalId) {
        setSelectedGoalId(null);
        setGoalStatus(null);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await goalAPI.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const selectedGoal = goals.find((g) => g._id === selectedGoalId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-surface-light shadow-lg border-b border-accent-dark border-opacity-20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Thrive</h1>
            {username && <p className="text-sm text-text-muted">Welcome, {username}</p>}
          </div>
          <div className="flex gap-3 items-center">
            {selectedGoal && selectedGoal.tasks.length > visibleTasks.size && (
              <button
                onClick={() => setShowHiddenTasks(!showHiddenTasks)}
                className="px-4 py-2 bg-accent-light text-background-light rounded-lg hover:bg-primary transition-colors text-sm font-semibold"
              >
                {showHiddenTasks ? 'Hide Hidden' : `Hidden (${selectedGoal.tasks.length - visibleTasks.size})`}
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-text-muted hover:bg-background-light rounded-lg transition-colors hover:text-primary font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {goals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg mb-4">No collections present</p>
            <button
              onClick={() => setIsCreateCollectionModalOpen(true)}
              className="px-6 py-2 bg-gradient-to-r from-primary to-accent-light text-white rounded-lg hover:shadow-lg hover:shadow-primary hover:shadow-opacity-50 transition-all font-semibold"
            >
              Create First Collection
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Title Dropdown */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-text-light mb-2">
                  Select Collection
                </label>
                <TitleDropdown
                  goals={goals}
                  selectedGoalId={selectedGoalId}
                  onSelectGoal={handleSelectGoal}
                  onCreateNewGoal={() => setIsCreateCollectionModalOpen(true)}
                  onDeleteGoal={handleDeleteGoal}
                />
              </div>
            </div>

            {/* Tasks List */}
            {selectedGoal && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-text-light mb-2">{selectedGoal.title}</h2>
                  {selectedGoal.description && (
                    <p className="text-text-muted text-sm">{selectedGoal.description}</p>
                  )}
                </div>

                {/* Task Rows */}
                <div className="space-y-3">
                  {selectedGoal.tasks
                    .filter((task) => visibleTasks.has(task._id))
                    .map((task) => {
                      const completedTask = goalStatus?.completedTasks.find(
                        (ct) => ct.taskId === task._id
                      );
                      return (
                        <TaskRow
                          key={task._id}
                          task={task}
                          completedDays={completedTask?.completedDays || []}
                          onToggleDay={() => handleToggleTaskDay(task._id)}
                          onDelete={() => handleDeleteTask(task._id)}
                          onHide={() => handleHideTask(task._id)}
                        />
                      );
                    })}
                </div>

                {/* Hidden Tasks Section */}
                {showHiddenTasks && (
                  <div className="mt-8 pt-6 border-t border-gray-300">
                    <h3 className="text-lg font-semibold text-text-light mb-4">Hidden Tasks</h3>
                    <div className="space-y-3">
                      {selectedGoal.tasks
                        .filter((task) => !visibleTasks.has(task._id))
                        .map((task) => {
                          return (
                            <div
                              key={task._id}
                              className="flex items-center justify-between p-4 rounded-xl border bg-yellow-50 border-yellow-200"
                            >
                              <div>
                                <p className="font-medium text-text-light">{task.name}</p>
                                <p className="text-xs text-text-muted">{task.targetDays} days target</p>
                              </div>
                              <button
                                onClick={() => setVisibleTasks(new Set([...visibleTasks, task._id]))}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-soft transition-colors text-sm font-medium"
                              >
                                Unhide
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}


                {/* Add Task Button */}
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="w-full py-3 border-2 border-dashed rounded-xl transition-colors font-medium border-gray-300 text-text-muted hover:border-primary hover:text-primary"
                >
                  + Add Task
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAdd={handleAddTask}
      />

      <CreateCollectionModal
        isOpen={isCreateCollectionModalOpen}
        onClose={() => setIsCreateCollectionModalOpen(false)}
        onCreate={handleCreateCollection}
      />
    </div>
  );
};

export default Dashboard;
