const Task = require('../models/Task');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Get all tasks for current user (with Search & Filter)
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = catchAsync(async (req, res) => {
  const { search, status, priority, sortBy } = req.query;

  // 1. Base Query: Only retrieve tasks belonging to logged-in user
  const queryObj = { user: req.user._id };

  // 2. Filter by Status
  if (status) {
    queryObj.status = status.toUpperCase();
  }

  // 3. Filter by Priority
  if (priority) {
    queryObj.priority = priority.toUpperCase();
  }

  // 4. Search by Keyword (title or description)
  if (search) {
    queryObj.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // 5. Sorting
  let sortOption = { createdAt: -1 }; // Default: Newest first
  if (sortBy === 'dueDate') {
    sortOption = { dueDate: 1 };
  } else if (sortBy === 'priority') {
    sortOption = { priority: -1 };
  }

  const tasks = await Task.find(queryObj).sort(sortOption);

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  });
});

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = catchAsync(async (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    return next(new AppError('Task title is required', 400));
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    user: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: { task }
  });
});

// @desc    Get single task by ID
// @route   GET /api/v1/tasks/:id
// @access  Private
const getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return next(new AppError('Task not found or unauthorized access', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { task }
  });
});

// @desc    Update task details
// @route   PATCH /api/v1/tasks/:id
// @access  Private
const updateTask = catchAsync(async (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title, description, status, priority, dueDate },
    { new: true, runValidators: true }
  );

  if (!task) {
    return next(new AppError('Task not found or unauthorized access', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { task }
  });
});

// @desc    Update task status only (Useful for Kanban Drag & Drop)
// @route   PATCH /api/v1/tasks/:id/status
// @access  Private
const updateTaskStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!status || !['TODO', 'IN_PROGRESS', 'COMPLETED'].includes(status.toUpperCase())) {
    return next(new AppError('Please provide a valid status: TODO, IN_PROGRESS, or COMPLETED', 400));
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status: status.toUpperCase() },
    { new: true, runValidators: true }
  );

  if (!task) {
    return next(new AppError('Task not found or unauthorized access', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { task }
  });
});

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    return next(new AppError('Task not found or unauthorized access', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
};