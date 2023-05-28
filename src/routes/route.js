const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const taskController = require("../controllers/taskController");

router.post("/user", userController.createUser);

router.post("/task", taskController.createTask);
router.get("/tasks", taskController.getTask);
router.delete("/tasks/:userId/:taskId", taskController.deleteTask);
router.put("/task/:userId/:taskId", taskController.updateTask);

router.all("/*", function (req, res) {
  res.status(400).send({ status: false, message: "Invalid HTTP Request" });
});

module.exports = router;