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
  isFirstTask,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get first day of current month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
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
    <div className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
      {/* Task Name */}
      <div className="w-56 shrink-0 px-6 py-5">
        <p className="font-semibold text-gray-900 dark:text-white text-base">{task.name}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{task.targetDays} days target</p>
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
              className={`w-11 h-11 flex items-center justify-center rounded-lg border-2 transition-all shrink-0 ${
                isFuture
                  ? 'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-not-allowed'
                  : isCompleted
                  ? 'bg-green-500 border-green-600 cursor-pointer hover:bg-green-600'
                  : isMissed
                  ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/50'
                  : isToday
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800 cursor-pointer'
              }`}
              title={`${dayName}, ${dateString}${isFuture ? ' (Future)' : isMissed ? ' (Missed)' : isCompleted ? ' (Completed)' : ''}`}
            >
              {/* Show status symbol */}
              {isCompleted ? (
                <span className="text-white text-xl font-bold">✓</span>
              ) : isMissed ? (
                <span className="text-red-600 dark:text-red-400 text-xl font-bold">!</span>
              ) : (
                <span className="text-gray-400 dark:text-gray-600 text-2xl">□</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Menu */}
      <div className="flex gap-2 shrink-0 w-40 px-4 py-4 justify-center">
        <button
          onClick={onHide}
          className="px-3 py-1.5 text-sm rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium"
        >
          Hide
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-sm rounded-lg transition-colors text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskRow;
