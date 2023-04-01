const express = require("express");
const { addCustomer, getCustomers, updateCustomer } = require("../controllers/customer");
const router = express.Router();

router.route("/").post(addCustomer);
router.route("/").get(getCustomers);
router.route("/:customerId").patch(updateCustomer);
module.exports = router;
