import React, { useState } from 'react';

interface TitleDropdownProps {
  goals: any[];
  selectedGoalId: string | null;
  onSelectGoal: (goalId: string) => void;
  onCreateNewGoal: () => void;
  onDeleteGoal: (goalId: string) => void;
}

const TitleDropdown: React.FC<TitleDropdownProps> = ({
  goals,
  selectedGoalId,
  onSelectGoal,
  onCreateNewGoal,
  onDeleteGoal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const selectedGoal = goals.find((g) => g._id === selectedGoalId);

  return (
    <div className="relative w-full max-w-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left border rounded-lg hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex justify-between items-center bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
      >
        <span className="font-medium">{selectedGoal?.title || 'Select a collection'}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 border rounded-lg shadow-lg z-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          {goals.length === 0 ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-300">No collections present</div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal._id}
                className="flex items-center justify-between p-3 border-b last:border-b-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
              >
                <button
                  onClick={() => {
                    onSelectGoal(goal._id);
                    setIsOpen(false);
                  }}
                  className="flex-1 text-left"
                >
                  <p className="font-medium text-gray-900 dark:text-white">{goal.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{goal.tasks.length} tasks</p>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(goal._id)}
                  className="px-2 py-1 rounded text-sm transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  ×
                </button>

                {showDeleteConfirm === goal._id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                      <p className="mb-4 text-gray-900 dark:text-white">Delete this collection?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onDeleteGoal(goal._id);
                            setShowDeleteConfirm(null);
                            setIsOpen(false);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1 rounded-lg transition-colors bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          <button
            onClick={() => {
              onCreateNewGoal();
              setIsOpen(false);
            }}
            className="w-full p-3 text-left font-medium transition-colors border-t text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
          >
            + Add New Collection
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleDropdown;
