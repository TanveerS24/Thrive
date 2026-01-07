import React, { useState } from 'react';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string, tasks: any[]) => Promise<void>;
  isLoading?: boolean;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
}) => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([{ name: '', targetDays: 21 }]);
  const [error, setError] = useState('');

  const handleAddTask = () => {
    setTasks([...tasks, { name: '', targetDays: 21 }]);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index: number, field: string, value: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Collection name is required');
      return;
    }

    const validTasks = tasks.filter((t) => t.name.trim());
    if (validTasks.length === 0) {
      setError('At least one task is required');
      return;
    }

    try {
      await onCreate(title, description, validTasks);
      setTitle('');
      setDescription('');
      setTasks([{ name: '', targetDays: 21 }]);
      onClose();
    } catch (err) {
      setError('Failed to create collection');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto bg-surface-light border border-accent-dark border-opacity-40 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-text-light">Create New Collection</h2>
        <p className="text-text-muted text-sm mb-6">Organize your habits into meaningful collections</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Collection Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fitness Goals"
              className="w-full px-4 py-3 border border-accent-dark border-opacity-40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background-light text-text-light placeholder-text-muted transition"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your collection"
              rows={2}
              className="w-full px-4 py-3 border border-accent-dark border-opacity-40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background-light text-text-light placeholder-text-muted transition"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Tasks
            </label>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                    placeholder="Task name"
                    className="flex-1 px-4 py-3 border border-accent-dark border-opacity-40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background-light text-text-light placeholder-text-muted transition"
                    disabled={isLoading}
                  />
                  <input
                    type="number"
                    value={task.targetDays}
                    onChange={(e) => handleTaskChange(index, 'targetDays', Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="365"
                    className="w-20 px-4 py-3 border border-accent-dark border-opacity-40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background-light text-text-light transition"
                    disabled={isLoading}
                  />
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(index)}
                      className="px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-900 hover:bg-opacity-20 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddTask}
              className="mt-2 text-sm font-medium transition-colors text-primary hover:text-primary-soft"
            >
              + Add Another Task
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-2 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent-light text-white rounded-lg hover:shadow-lg hover:shadow-primary hover:shadow-opacity-50 disabled:opacity-50 transition-all font-semibold"
            >
              {isLoading ? 'Creating...' : 'Create Collection'}
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

export default CreateCollectionModal;
