const express = require("express");
const { addCustomer, getCustomers, updateCustomer, deleteCustomer, getCustomer } = require("../controllers/customer");
const router = express.Router();

router.route("/").post(addCustomer);
router.route("/").get(getCustomers);
router.route("/:customerId").patch(updateCustomer).delete(deleteCustomer).get(getCustomer);
module.exports = router;
