import express from 'express';
import createTitle from '../../controllers/goal/createTitle.controller.js';
import addTask from '../../controllers/goal/addTask.controller.js';
import editGoal from '../../controllers/goal/editGoal.controller.js';
import toggleCompletedTask from '../../controllers/goal/toggleCompletedTask.controller.js';
import deleteTask from '../../controllers/goal/deleteTask.controller.js';
import deleteGoal from '../../controllers/goal/deleteGoal.controller.js';
import getUserGoals from '../../controllers/goal/getUserGoals.controller.js';
import getGoalStatus from '../../controllers/goal/getGoalStatus.controller.js';

const router = express.Router();

// Get user's goals
router.get('/user/:userId', getUserGoals);

// Get goal status
router.get('/status/:goalId', getGoalStatus);

// Create a new goal with title, description, and tasks
router.post('/create/:userId', createTitle);

// Add a task to an existing goal
router.post('/add-task/:goalId', addTask);

// Edit goal title, description, and task names
router.put('/edit/:goalId', editGoal);

// Toggle task completion status (add/remove current date)
router.post('/toggle-completed/:goalStatusId/:taskId', toggleCompletedTask);

// Delete a specific task
router.delete('/delete-task/:goalId/:taskId', deleteTask);

// Delete entire goal
router.delete('/:goalId', deleteGoal);

export default router;
