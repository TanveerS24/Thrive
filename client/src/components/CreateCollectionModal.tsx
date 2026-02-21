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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto bg-white dark:bg-ember-coal/95 border-2 border-gray-300 dark:border-ember-flame shadow-2xl dark:shadow-ember-lg">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-text-ember">Create New Collection</h2>
        <p className="text-gray-700 dark:text-text-muted text-sm mb-6 font-semibold">Organize your habits into meaningful collections</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-text-ember mb-2">
              Collection Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fitness Goals"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-ember-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-transparent bg-white dark:bg-ember-coal text-gray-900 dark:text-text-dark placeholder-gray-500 dark:placeholder-text-muted transition font-medium"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-text-ember mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your collection"
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-ember-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-transparent bg-white dark:bg-ember-coal text-gray-900 dark:text-text-dark placeholder-gray-500 dark:placeholder-text-muted transition font-medium"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-text-ember mb-2">
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
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-ember-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-transparent bg-white dark:bg-ember-coal text-gray-900 dark:text-text-dark placeholder-gray-500 dark:placeholder-text-muted transition font-medium"
                    disabled={isLoading}
                  />
                  <input
                    type="number"
                    value={task.targetDays}
                    onChange={(e) => handleTaskChange(index, 'targetDays', Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="365"
                    className="w-20 px-4 py-3 border-2 border-gray-300 dark:border-ember-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-transparent bg-white dark:bg-ember-coal text-gray-900 dark:text-text-dark transition font-bold text-center"
                    disabled={isLoading}
                  />
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(index)}
                      className="px-3 py-2 rounded-lg transition-colors text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 font-bold"
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
              className="mt-2 text-sm font-bold transition-colors text-primary dark:text-ember-flame hover:text-primary-dark dark:hover:text-accent"
            >
              + Add Another Task
            </button>
          </div>

          {error && <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>}

          <div className="flex gap-2 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent dark:from-ember-flame dark:to-primary text-white rounded-lg hover:shadow-ember-lg disabled:opacity-50 transition-all font-bold"
            >
              {isLoading ? 'Creating...' : 'Create Collection'}
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

export default CreateCollectionModal;
