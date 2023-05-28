const taskModel = require("../models/taskModel");
const { isValidObjectId } = require("mongoose");

//============= Create Task ==============
const createTask = async function (req, res) {
  try {
    let task = req.body;
    let { taskName, dueDate, userId } = task;
    if (!taskName) {
      return res
        .status(400)
        .send({ status: false, message: "Task name is mandatory" });
    }

    if (!dueDate) {
      return res
        .status(400)
        .send({ status: false, message: "Due date is mandatory" });
    }

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "User ID is mandatory" });
    }

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "User ID is not valid " });
    }
    const taskData = await taskModel.create(task);
    return res.status(201).send({ status: true, data: taskData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//============= Get Task ==============
const getTask = async function (req, res) {
  try {
    const { taskName, dueDate, status } = req.query;
    const query = {};
    if (taskName) {
      query.taskName = taskName;
    }
    if (dueDate) {
      query.dueDate = dueDate;
    }
    if (status) {
      query.status = status;
    }

    const saveData = await taskModel.find(query);
    if (saveData.length == 0) {
      return res
        .status(404)
        .send({ status: false, msg: "Task is not available" });
    } else {
      return res.status(200).send({ status: true, data: saveData });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: "error message" });
  }
};

//============= Delete Task ==============
const deleteTask = async function (req, res) {
  try {
    const userId = req.params.userId;
    const taskId = req.params.taskId;
    if (!isValidObjectId(userId)) {
      return res
        .status(404)
        .send({ status: false, message: "User id is not valid" });
    }
    if (!isValidObjectId(taskId)) {
      return res
        .status(404)
        .send({ status: false, message: "Task id is not valid" });
    }

    const checkTaskId = await taskModel.findById(taskId);
    if (String(userId) !== String(checkTaskId.userId)) {
      console.log(String(userId));

      return res
        .status(403)
        .send({ status: false, message: "User is not authorized" });
    }
    if (!checkTaskId || checkTaskId.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, message: "Task already deleted" });
    }
    const deleteTask = await taskModel.findOneAndUpdate(
      { _id: taskId },
      { $set: { isDeleted: true } }
    );
    return res
      .status(200)
      .send({ staus: true, message: "Sucessfully Deleted " });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//============= Update Task ==============
const updateTask = async function (req, res) {
  try {
    let data = req.body;
    let { taskName, dueDate, status } = data;
    const userId = req.params.userId;
    const taskId = req.params.taskId;

    if (!isValidObjectId(userId)) {
      return res
        .status(404)
        .send({ status: false, message: "User id is not valid" });
    }
    if (!isValidObjectId(taskId)) {
      return res
        .status(404)
        .send({ status: false, message: "Task id is not valid" });
    }
    const checkTaskId = await taskModel.findById(taskId);
    console.log(checkTaskId);
    if (String(userId) !== String(checkTaskId.userId)) {
      console.log(String(userId));

      return res
        .status(403)
        .send({ status: false, message: "User is not authorized" });
    }

    const existTask = await taskModel.findOne({
      _id: taskId,
      isDeleted: false,
    });
    if (!existTask) {
      return res
        .status(404)
        .send({ status: false, message: " No task found with given id." });
    }

    const checktaskName = await taskModel.findOne({ taskName: data.taskName });
    if (checktaskName) {
      return res
        .status(400)
        .send({ status: false, message: "Task is already present." });
    }

    const checkdueDate = await taskModel.findOne({ dueDate: data.dueDate });
    if (checkdueDate) {
      return res
        .status(400)
        .send({ status: false, message: "Due date is already present." });
    }
    // Validate the status field
    if (status !== "pending" && status !== "completed") {
      return res.status(400).send({
        status: false,
        message:
          "Invalid status. Status must be either 'pending' or 'completed'.",
      });
    }

    const updateTask = await taskModel.findOneAndUpdate(
      { _id: taskId },
      {
        $set: {
          taskName: data.taskName,
          dueDate: data.dueDate,
          status: data.status,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Success", data: updateTask });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createTask, getTask, deleteTask, updateTask };