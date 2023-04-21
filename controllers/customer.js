const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnprocessableEntityError = require("../errors/UnprocessableEntityError");
const Customer = require("../models/Customer");

const addCustomer = async (req, res) => {
  const { userId } = req.user;
  const { name, description, labelId } = req.body;

  if (!name) {
    throw new BadRequestError("Name is not provided");
  }

  let customer;
  try {
    customer = await Customer.create({ name, description, createdBy: userId, labelId });
  } catch (err) {
    // return res.status(400).json(err);
    // if (err.name === "ValidationError") {
    //   if (err.errors.labelId.kind === "user defined") {
    //     throw new UnprocessableEntityError("could not process the request due to invalid label id");
    //   }

    //   throw new BadRequestError("Invalid label id");
    // }
    if (err.name === "ValidationError" && err.errors.labelId) {
      throw new UnprocessableEntityError("could not process the request due to invalid label id");
    }
  }

  return res.json({ customer });
};

const getCustomers = async (req, res) => {
  const { userId } = req.user;
  let { label: labelId, page, limit } = req.query;
  // let tempPage = page;
  // let tempLimit = limit;

  // if (isNaN(page) || isNaN(limit)) {
  //   tempPage = 1;
  //   tempLimit = 10;
  // }

  // if (page <= 0) {
  //   tempPage = 1;
  // }

  // if (limit <= 0) {
  //   tempLimit = 10;
  // }

  // const skip = (tempPage - 1) * tempLimit;

  // if (!labelId || labelId === "null") {
  //   return res.json({ customers: [], customersCount: 0 });
  // }

  try {
    const result = Customer.find({ createdBy: userId, labelId });

    page = Number(page);
    limit = Number(limit);

    if (!isNaN(page)) {
      console.log("here");
      if (page < 1) {
        page = 1;
      }

      if (!limit || isNaN(limit) || limit < 1) {
        limit = 10;
      }

      const skip = (page - 1) * limit;

      result.skip(skip).limit(limit);
    }

    const customers = await result;
    const customersCount = await Customer.countDocuments({ createdBy: userId, labelId });

    return res.status(200).json({ customers, customersCount });
  } catch (err) {
    //Handling cast error
    return res.json({ customers: [], customersCount: 0 });
  }
};

const getCustomer = async (req, res) => {
  const { userId } = req.user;
  const { customerId } = req.params;
  try {
    const customer = await Customer.findOne({ createdBy: userId, _id: customerId });

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }
    return res.json({ customer });
  } catch (err) {
    throw new NotFoundError("Customer not found");
  }
};

const updateCustomer = async (req, res) => {
  const { userId } = req.user;
  const { name, description, labelId } = req.body;
  const { customerId } = req.params;

  // if (!name || !description || !labelId) {
  //   throw new BadRequestError("Field cannot be empty");
  // }
  try {
    const customer = await Customer.findOneAndUpdate(
      { createdBy: userId, _id: customerId },
      { ...req.body, createdBy: userId },
      {
        runValidators: true,
        new: true,
      }
    );

    // When id is valid (12 bytes), but can't find customer it return null (doesn't throw an error)
    // Throw an error if labelId validation fail and _id validation fail
    if (!customer) {
      throw new NotFoundError("Customer doesn't exist");
      // next(err);
    }

    return res.json({ customer });
  } catch (err) {
    // return res.json(err);
    // if (err.name === "ValidationError") {
    //   throw new UnprocessableEntityError("could not process the request due to invalid label id");
    // }
    // if (err.name === "CastError") {
    //   throw new BadRequestError("Invalid label id");
    // }

    // console.log("ERROR COK");
    // return res.json(err);

    // if (err.name === "CastError") {
    //   if (err.path === "_id") {
    //     throw new BadRequestError("Customer doesn't exist");
    //   }
    // }

    //Checking if customer is found or not (invalid _id will result in customer not found)

    if (err instanceof NotFoundError || (err.name === "CastError" && err.path === "_id")) {
      throw new NotFoundError("customer doesn't exist");
    }

    if (err.name === "ValidationError") {
      if (err.errors.name) {
        throw new BadRequestError("name is required");
      }

      if (err.errors.labelId) {
        throw new BadRequestError("invalid label id");
      }
    }

    //Invalid label mongodb label id (not 12 bytes)
    if (err.name === "CastError") {
      throw new BadRequestError("invalid label id");
    }

    return res.json(err);

    //Label id validation fail
    // throw new UnprocessableEntityError("could not process the request due to invalid label id");
  }
};

const deleteCustomer = async (req, res) => {
  const { customerId } = req.params;
  const { userId } = req.user;

  const deletedCustomer = await Customer.findOneAndDelete({ _id: customerId, createdBy: userId });

  if (!deletedCustomer) {
    throw new NotFoundError("Customer not found");
  }
  return res.json({ deletedCustomer });
};

const searchCustomers = async (req, res) => {
  const { q } = req.query;
  const { userId, page = 1, limit = 10 } = req.user;

  const skip = (page - 1) * limit;

  if (q) {
    const customers = await Customer.find({
      $text: {
        $search: q,
      },
      createdBy: userId,
    })
      .skip(skip)
      .limit(limit);

    return res.json({ customers });
  }

  throw new BadRequestError("missing required parameter 'q'");
};

module.exports = { addCustomer, getCustomers, updateCustomer, deleteCustomer, getCustomer, searchCustomers };
