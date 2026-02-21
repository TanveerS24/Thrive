import React from 'react';

interface Task {
  _id: string;
  name: string;
  targetDays: number;
}

interface TaskRowProps {
  task: Task;
  completedDays: string[];
  onToggleDay: (dateString: string) => void;
  onDelete: () => void;
  onHide: () => void;
  isFirstTask: boolean;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  completedDays,
  onToggleDay,
  onDelete,
  onHide,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get last day of current month
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  // Calculate total days in month
  const daysInMonth = lastDayOfMonth.getDate();

  const getDateInfo = (dayOfMonth: number) => {
    const date = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
    const dateString = date.toISOString().split('T')[0];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[date.getDay()];
    const isFuture = date > today;
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    
    return { dateString, dayName, dayOfMonth, isFuture, isPast, isToday };
  };

  return (
    <div className="flex items-center hover:bg-gray-50 dark:hover:bg-ember-ash/30 transition-colors border-b border-gray-100 dark:border-ember-ash/50 last:border-b-0">
      {/* Task Name */}
      <div className="w-56 shrink-0 px-6 py-5">
        <p className="font-bold text-gray-900 dark:text-text-ember text-base">{task.name}</p>
        <p className="text-xs font-medium text-gray-700 dark:text-text-muted mt-1">{task.targetDays} days target</p>
      </div>

      {/* Day Checkboxes - Show all days of month from 1 to end */}
      <div className="flex gap-2 px-4 py-4" style={{ minWidth: 'calc(31 * 52px)' }}>
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const dayNum = index + 1;
          const { dateString, dayName, isFuture, isPast, isToday } = getDateInfo(dayNum);
          const isCompleted = completedDays.includes(dateString);
          const isMissed = isPast && !isCompleted;
          
          return (
            <button
              key={index}
              onClick={() => !isFuture && onToggleDay(dateString)}
              disabled={isFuture}
              className={`w-11 h-11 flex items-center justify-center rounded-lg border-2 transition-all shrink-0 font-bold ${
                isFuture
                  ? 'bg-gray-200 dark:bg-ember-coal/80 border-gray-400 dark:border-ember-ash cursor-not-allowed opacity-60'
                  : isCompleted
                  ? 'bg-primary dark:bg-ember-flame border-primary-dark dark:border-ember-glow cursor-pointer hover:bg-primary-dark dark:hover:shadow-ember shadow-md'
                  : isMissed
                  ? 'bg-red-200 dark:bg-red-900/50 border-red-400 dark:border-red-600 cursor-pointer hover:bg-red-300 dark:hover:bg-red-900/70'
                  : isToday
                  ? 'border-2 border-primary dark:border-ember-flame bg-orange-100 dark:bg-ember-ash/60 cursor-pointer hover:bg-orange-200 dark:hover:bg-ember-ash/80 shadow-lg dark:shadow-ember'
                  : 'border-gray-400 dark:border-ember-ash hover:border-primary dark:hover:border-ember-flame bg-white dark:bg-ember-coal/60 cursor-pointer hover:shadow-md'
              }`}
              title={`${dayName}, ${dateString}${isFuture ? ' (Future)' : isMissed ? ' (Missed)' : isCompleted ? ' (Completed)' : ''}`}
            >
              {/* Show status symbol */}
              {isCompleted ? (
                <span className="text-white text-xl font-bold">✓</span>
              ) : isMissed ? (
                <span className="text-red-600 dark:text-red-400 text-xl font-bold">!</span>
              ) : (
                <span className="text-gray-400 dark:text-text-muted text-2xl">□</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Menu */}
      <div className="flex gap-2 shrink-0 w-40 px-4 py-4 justify-center">
        <button
          onClick={onHide}
          className="px-3 py-1.5 text-sm rounded-lg transition-all font-semibold text-gray-700 dark:text-text-ember bg-gray-100 dark:bg-ember-ash/60 hover:bg-gray-200 dark:hover:bg-ember-ash hover:shadow-md border border-gray-300 dark:border-ember-ash"
        >
          Hide
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-sm rounded-lg transition-all font-semibold text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 hover:shadow-md border border-red-700 dark:border-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskRow;
