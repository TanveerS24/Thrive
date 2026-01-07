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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="rounded-2xl p-8 max-w-md w-full mx-4 bg-surface-light border border-accent-dark border-opacity-40 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-text-light">Add New Task</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Morning exercise"
              className="w-full px-4 py-3 border border-accent-dark border-opacity-40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background-light text-text-light placeholder-text-muted transition"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Target Days
            </label>
            <input
              type="number"
              value={targetDays}
              onChange={(e) => setTargetDays(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-full px-4 py-3 border border-accent-dark border-opacity-40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background-light text-text-light placeholder-text-muted transition"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-2 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent-light text-white rounded-lg hover:shadow-lg hover:shadow-primary hover:shadow-opacity-50 disabled:opacity-50 transition-all font-semibold"
            >
              {isLoading ? 'Adding...' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg transition-colors font-semibold bg-accent-dark text-text-light hover:bg-accent-light hover:text-background-light disabled:opacity-50"
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
