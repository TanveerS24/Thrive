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
        className="w-full px-4 py-3 text-left border-2 rounded-lg hover:border-primary dark:hover:border-ember-flame focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame transition-all flex justify-between items-center bg-white dark:bg-ember-coal border-gray-300 dark:border-ember-ash text-gray-900 dark:text-text-ember font-semibold shadow-sm hover:shadow-md"
      >
        <span className="font-medium">{selectedGoal?.title || 'Select a collection'}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 border-2 rounded-lg shadow-xl dark:shadow-ember-lg z-10 bg-white dark:bg-ember-coal/95 border-gray-300 dark:border-ember-ash backdrop-blur-sm">
          {goals.length === 0 ? (
            <div className="p-4 text-center text-gray-600 dark:text-text-muted font-semibold">No collections present</div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal._id}
                className="flex items-center justify-between p-3 border-b last:border-b-0 transition-colors hover:bg-gray-50 dark:hover:bg-ember-ash/40 border-gray-200 dark:border-ember-ash"
              >
                <button
                  onClick={() => {
                    onSelectGoal(goal._id);
                    setIsOpen(false);
                  }}
                  className="flex-1 text-left"
                >
                  <p className="font-bold text-gray-900 dark:text-text-ember">{goal.title}</p>
                  <p className="text-xs font-semibold text-gray-600 dark:text-text-muted">{goal.tasks.length} tasks</p>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(goal._id)}
                  className="px-2 py-1 rounded text-sm transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  ×
                </button>

                {showDeleteConfirm === goal._id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                    <div className="p-4 rounded-xl bg-white dark:bg-ember-coal border-2 border-gray-300 dark:border-ember-ash shadow-lg dark:shadow-ember">
                      <p className="mb-4 font-bold text-gray-900 dark:text-text-ember">Delete this collection?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onDeleteGoal(goal._id);
                            setShowDeleteConfirm(null);
                            setIsOpen(false);
                          }}
                          className="px-3 py-1 bg-red-600 dark:bg-red-700 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-bold text-sm"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1 rounded-lg transition-colors bg-gray-200 dark:bg-ember-ash text-gray-900 dark:text-text-muted hover:bg-gray-300 dark:hover:bg-ember-ash/70 dark:hover:text-text-ember font-bold text-sm"
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
            className="w-full p-3 text-left font-bold transition-all border-t-2 text-primary dark:text-ember-flame hover:bg-gray-50 dark:hover:bg-ember-ash/40 border-gray-200 dark:border-ember-ash"
          >
            + Add New Collection
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleDropdown;
