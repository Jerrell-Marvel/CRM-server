const BadRequestError = require("../errors/BadRequestError");
const Label = require("../models/Label");
const NotFoundError = require("../errors/NotFoundError");
const Customer = require("../models/Customer");

const addLabel = async (req, res) => {
  const { userId } = req.user;
  const { name } = req.body;

  if (!name) {
    throw new BadRequestError("Label name not provided");
  }
  const label = await Label.create({ name, createdBy: userId });
  return res.json({ label });
};

const getLabels = async (req, res) => {
  const { userId } = req.user;

  const labels = await Label.find({ createdBy: userId });
  return res.json({ labels });
};

const updateLabel = async (req, res) => {
  const { id: labelId } = req.params;
  const { userId } = req.user;
  const { name } = req.body;

  const updatedLabel = await Label.findOneAndUpdate(
    { _id: labelId, createdBy: userId },
    { name },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedLabel) {
    throw new NotFoundError("Label not found");
  }

  return res.json({ updatedLabel });
};

const deleteLabel = async (req, res) => {
  const { id: labelId } = req.params;
  const { userId } = req.user;

  // https://www.codingninjas.com/codestudio/library/delete-the-documents-using-mongoose-1218
  const deletedLabel = await Label.findOneAndDelete({ _id: labelId, createdBy: userId });
  const deletedCustomers = await Customer.deleteMany({ labelId, createdBy: userId });
  console.log(deletedCustomers);

  if (!deletedLabel) {
    throw new NotFoundError("Label not found");
  }
  return res.json({ deletedLabel });
};

module.exports = { addLabel, getLabels, updateLabel, deleteLabel };
