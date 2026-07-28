const express = require('express');
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply protect middleware to ALL task routes
router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(createTask);

router
  .route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

// Route specifically for updating status (Drag and Drop friendliness)
router.patch('/:id/status', updateTaskStatus);

module.exports = router;