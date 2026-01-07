import React from 'react';

interface Task {
  _id: string;
  name: string;
  targetDays: number;
}

interface TaskRowProps {
  task: Task;
  completedDays: string[];
  onToggleDay: (dayIndex: number) => void;
  onDelete: () => void;
  onHide: () => void;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  completedDays,
  onToggleDay,
  onDelete,
  onHide,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-surface-light border-accent-dark border-opacity-30">
      {/* Task Name */}
      <div className="w-48 shrink-0">
        <p className="font-medium text-text-light">{task.name}</p>
        <p className="text-xs text-text-muted">{task.targetDays} days target</p>
      </div>

      {/* Day Checkboxes */}
      <div className="flex gap-2 flex-1 overflow-x-auto pb-2">
        {Array.from({ length: task.targetDays }).map((_, index) => (
          <button
            key={index}
            onClick={() => onToggleDay(index)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 transition-colors shrink-0 ${
              completedDays.includes(new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                ? 'bg-primary border-primary'
                : 'border-accent-dark border-opacity-40 hover:border-accent-dark'
            }`}
            title={`Day ${index + 1}`}
          >
            {completedDays.includes(new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) && (
              <span className="text-white font-bold">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Action Menu */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onHide}
          className="px-3 py-1 text-sm rounded-lg transition-colors text-text-muted hover:bg-background-light hover:text-primary"
        >
          Hide
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm rounded-lg transition-colors text-red-600 hover:bg-red-900 hover:bg-opacity-20"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskRow;
