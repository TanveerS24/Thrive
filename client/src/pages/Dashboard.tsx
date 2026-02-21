import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { goalAPI } from '../services/api';
import TaskRow from '../components/TaskRow';
import TitleDropdown from '../components/TitleDropdown';
import AddTaskModal from '../components/AddTaskModal';
import CreateCollectionModal from '../components/CreateCollectionModal';
import ThemeToggle from '../components/ThemeToggle';

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

  const handleToggleTaskDay = async (taskId: string, dateString: string) => {
    if (!goalStatus || !selectedGoalId) return;

    // Optimistic update - immediately update UI
    const taskCompletedIndex = goalStatus.completedTasks.findIndex(ct => ct.taskId === taskId);
    const newGoalStatus = { ...goalStatus };
    
    if (taskCompletedIndex !== -1) {
      const completedDays = [...newGoalStatus.completedTasks[taskCompletedIndex].completedDays];
      const dayIndex = completedDays.indexOf(dateString);
      
      if (dayIndex !== -1) {
        // Remove the date (unmark)
        completedDays.splice(dayIndex, 1);
      } else {
        // Add the date (mark as complete)
        completedDays.push(dateString);
      }
      
      newGoalStatus.completedTasks[taskCompletedIndex] = {
        ...newGoalStatus.completedTasks[taskCompletedIndex],
        completedDays
      };
    } else {
      // Task not in completed list yet, add it
      newGoalStatus.completedTasks.push({
        taskId,
        completedDays: [dateString]
      });
    }
    
    setGoalStatus(newGoalStatus);

    // Immediately update backend
    try {
      await goalAPI.toggleTaskCompletion(goalStatus._id, taskId, dateString);
      // Fetch fresh data from server after update
      fetchGoalStatus(selectedGoalId);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // Revert optimistic update on error
      fetchGoalStatus(selectedGoalId);
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary dark:border-ember-flame border-t-transparent dark:border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-900 dark:text-text-ember">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 min-h-screen">
      {/* Header */}
      <header className="bg-white/95 dark:bg-ember-coal/98 backdrop-blur-md shadow-lg dark:shadow-ember border-b-2 border-gray-200 dark:border-ember-flame/30">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-ember-flame">Thrive</h1>
            {username && <p className="text-sm text-gray-600 dark:text-text-muted">Welcome, {username}</p>}
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            {selectedGoal && selectedGoal.tasks.length > visibleTasks.size && (
              <button
                onClick={() => setShowHiddenTasks(!showHiddenTasks)}
                className="px-4 py-2 bg-primary dark:bg-ember-flame text-white rounded-lg hover:bg-primary-dark dark:hover:shadow-ember transition-all text-sm font-bold shadow-md"
              >
                {showHiddenTasks ? 'Hide Hidden' : `Hidden (${selectedGoal.tasks.length - visibleTasks.size})`}
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-800 dark:text-text-ember bg-gray-100 dark:bg-ember-ash/70 hover:bg-gray-200 dark:hover:bg-ember-ash rounded-lg transition-all font-bold shadow-md border border-gray-300 dark:border-ember-ash"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[95%] mx-auto px-8 py-8">
        {goals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-900 dark:text-text-ember text-xl font-bold mb-4">No collections present</p>
            <button
              onClick={() => setIsCreateCollectionModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent dark:from-ember-flame dark:to-primary text-white rounded-lg hover:shadow-ember-lg transition-all font-bold text-base shadow-lg"
            >
              Create First Collection
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Title Dropdown */}
            <div className="flex gap-4 items-end px-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-900 dark:text-text-ember mb-2">
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
              <div className="space-y-4 bg-transparent backdrop-blur-md rounded-2xl p-6 px-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-text-ember mb-2">{selectedGoal.title}</h2>
                  {selectedGoal.description && (
                    <p className="text-gray-800 dark:text-text-muted text-sm font-semibold">{selectedGoal.description}</p>
                  )}
                </div>

                {/* Calendar Table */}
                <div className="overflow-x-auto rounded-xl border-2 border-gray-300 dark:border-ember-ash bg-white dark:bg-ember-coal/70 dark:shadow-ember-lg">
                  {/* Header Row with Dates */}
                  <div className="bg-gradient-to-r from-primary to-accent dark:from-ember-flame dark:to-primary border-b-2 border-gray-300 dark:border-ember-glow/50">
                    <div className="flex items-center">
                      {/* Task Name Header */}
                      <div className="w-56 shrink-0 px-6 py-4">
                        <p className="font-black text-white text-lg">Task Name</p>
                      </div>
                      
                      {/* Dates Header - exact width calculation: 31 days * (44px button + 8px gap) */}
                      <div className="flex gap-2 px-4 py-4" style={{ minWidth: 'calc(31 * 52px)' }}>
                        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, index) => {
                          const dayNum = index + 1;
                          const date = new Date(new Date().getFullYear(), new Date().getMonth(), dayNum);
                          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                          const dayName = dayNames[date.getDay()];
                          
                          return (
                            <div
                              key={index}
                              className="w-11 h-11 shrink-0 flex flex-col items-center justify-center"
                            >
                              <span className="text-sm font-black text-white leading-tight">{dayNum}</span>
                              <span className="text-[10px] text-white/95 leading-tight font-bold">{dayName}</span>
                            </div>
                          );
                        })}  
                      </div>
                      
                      {/* Actions Header */}
                      <div className="w-40 shrink-0 px-4 py-4">
                        <p className="font-black text-white text-center">Actions</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Task Rows */}
                  <div className="divide-y divide-gray-200 dark:divide-ember-ash">
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
                            onToggleDay={(dateString) => handleToggleTaskDay(task._id, dateString)}
                            onDelete={() => handleDeleteTask(task._id)}
                            onHide={() => handleHideTask(task._id)}
                            isFirstTask={false}
                          />
                        );
                      })}
                  </div>
                </div>

                {/* Hidden Tasks Section */}
                {showHiddenTasks && (
                  <div className="mt-8 pt-6 border-t-2 border-gray-300 dark:border-ember-ash">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-text-ember mb-4">Hidden Tasks</h3>
                    <div className="space-y-3">
                      {selectedGoal.tasks
                        .filter((task) => !visibleTasks.has(task._id))
                        .map((task) => {
                          return (
                            <div
                              key={task._id}
                              className="flex items-center justify-between p-4 rounded-xl border-2 bg-yellow-50 dark:bg-ember-ash/50 border-yellow-300 dark:border-ember-flame/40"
                            >
                              <div>
                                <p className="font-bold text-gray-900 dark:text-text-ember">{task.name}</p>
                                <p className="text-xs font-semibold text-gray-700 dark:text-text-muted">{task.targetDays} days target</p>
                              </div>
                              <button
                                onClick={() => setVisibleTasks(new Set([...visibleTasks, task._id]))}
                                className="px-4 py-2 bg-primary dark:bg-ember-flame text-white rounded-xl hover:bg-primary-dark dark:hover:shadow-ember transition-all text-sm font-bold shadow-md"
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
                  className="w-full py-3 border-2 border-dashed rounded-xl transition-all font-bold text-base border-gray-400 dark:border-ember-ash text-gray-800 dark:text-text-ember hover:border-primary dark:hover:border-ember-flame hover:bg-orange-50 dark:hover:bg-ember-ash/30 dark:hover:text-text-ember hover:shadow-md"
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
    </div>
  );
};

export default Dashboard;
