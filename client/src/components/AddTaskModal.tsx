import React, { useState } from 'react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, targetDays: number) => Promise<void>;
  isLoading?: boolean;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd, isLoading = false }) => {
  const [taskName, setTaskName] = useState('');
  const [targetDays, setTargetDays] = useState(21);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!taskName.trim()) {
      setError('Task name is required');
      return;
    }

    if (targetDays < 1) {
      setError('Target days must be at least 1');
      return;
    }

    try {
      await onAdd(taskName, targetDays);
      setTaskName('');
      setTargetDays(21);
      onClose();
    } catch (err) {
      setError('Failed to add task');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl p-8 max-w-md w-full mx-4 bg-white dark:bg-ember-coal/95 border-2 border-gray-300 dark:border-ember-flame shadow-2xl dark:shadow-ember-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-text-ember">Add New Task</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/40 border-2 border-red-400 dark:border-red-700 text-red-900 dark:text-red-200 rounded-lg text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-text-ember mb-2">
              Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Morning exercise"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-ember-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-transparent bg-white dark:bg-ember-coal text-gray-900 dark:text-text-dark placeholder-gray-500 dark:placeholder-text-muted transition font-medium"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-text-ember mb-2">
              Target Days
            </label>
            <input
              type="number"
              value={targetDays}
              onChange={(e) => setTargetDays(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-ember-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-transparent bg-white dark:bg-ember-coal text-gray-900 dark:text-text-dark placeholder-gray-500 dark:placeholder-text-muted transition font-medium"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>}

          <div className="flex gap-2 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent dark:from-ember-flame dark:to-primary text-white rounded-lg hover:shadow-ember-lg disabled:opacity-50 transition-all font-bold"
            >
              {isLoading ? 'Adding...' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-200 dark:bg-ember-ash text-gray-900 dark:text-text-ember hover:bg-gray-300 dark:hover:bg-ember-ash/70 rounded-lg transition-colors font-bold disabled:opacity-50 border border-gray-300 dark:border-ember-ash"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
