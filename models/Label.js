const mongoose = require("mongoose");

const LabelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Label = mongoose.model("Label", LabelSchema);

module.exports = Label;
