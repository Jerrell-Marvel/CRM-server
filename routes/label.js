const express = require("express");
const authentication = require("../middleware/authentication");
const { addLabel, getLabels, updateLabel, deleteLabel } = require("../controllers/label");
const router = express.Router();

router.post("/", addLabel);
router.get("/", getLabels);
router.patch("/:id", updateLabel);
router.delete("/:id", deleteLabel);

module.exports = router;
