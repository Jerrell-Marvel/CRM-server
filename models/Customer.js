const mongoose = require("mongoose");
const Label = require("./Label");

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  labelId: {
    type: mongoose.Types.ObjectId,
    ref: "Label",
    required: true,
    validate: {
      validator: async function (labelId) {
        // https://mongoosejs.com/docs/validation.html
        const label = await Label.findOne({ _id: this.get("labelId"), createdBy: this.get("createdBy") });

        // console.log(label);
        return !!label;
      },
    },
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
