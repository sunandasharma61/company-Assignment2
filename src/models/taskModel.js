const mongoose = require("mongoose");
const objectId= mongoose.Schema.Types.ObjectId

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  userId: {
    type:objectId,
    ref:"User",
    required:true
},
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  isDeleted: {
    type:Boolean,
    default: false
  }
});


module.exports = mongoose.model('task',taskSchema);
