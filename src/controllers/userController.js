const userModel = require("../models/userModel");

//============== Create User =========================
const createUser = async function (req, res) {
  try {
    const { userName } = req.body;
    if (!userName) {
      return res
        .status(400)
        .send({ status: "false", message: "User name must be present" });
    }
    const existingUser = await userModel.findOne({ userName });
    if (existingUser) {
      res.status(409).send("Username already exists");
      return;
    }
    const userCreated = await userModel.create({ userName });
    return res.status(201).send({ status: "true", user: userCreated });
  } catch (error) {
    return res.status(500).send({ status: "false", message: error.message });
  }
};

module.exports.createUser = createUser;