const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnprocessableEntityError = require("../errors/UnprocessableEntityError");
const Customer = require("../models/Customer");

const addCustomer = async (req, res) => {
  const { userId } = req.user;
  const { name, description, labelId } = req.body;
  try {
    const customer = await Customer.create({ name, description, createdBy: userId, labelId });
    return res.json({ customer });
  } catch (err) {
    if (err.name === "ValidationError" && err.errors.labelId) {
      throw new BadRequestError("Invalid label id");
    }
    if (err.name === "ValidationError" && err.errors.labelId) {
      throw new UnprocessableEntityError("could not process the request due to invalid label id");
    }
  }
};

const getCustomers = async (req, res) => {
  const { userId } = req.user;
  const { label: labelId } = req.query;

  if (!labelId) {
    return res.json({ customers: [] });
  }

  const customers = await Customer.find({ createdBy: userId, labelId });
  return res.json({ customers });
};

const updateCustomer = async (req, res) => {
  const { userId } = req.user;
  const { name, description, labelId } = req.body;
  const { customerId } = req.params;

  if (!name) {
    throw new BadRequestError("Name can't be empty");
  }

  try {
    const customer = await Customer.findOneAndUpdate(
      { createdBy: userId, _id: customerId },
      { name, description, labelId, createdBy: userId },
      {
        runValidators: true,
        new: true,
      }
    );
    return res.json({ customer });
  } catch (err) {
    if (err.name === "ValidationError" && err.errors.labelId) {
      throw new BadRequestError("Invalid label id");
    }

    if (err.name === "CastError" && err.path === "labelId") {
      throw new UnprocessableEntityError("could not process the request due to invalid label id");
    }
  }
};

module.exports = { addCustomer, getCustomers, updateCustomer };
