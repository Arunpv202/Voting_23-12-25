const express = require("express");
const provider = require("../provider");

const router = express.Router();

router.get("/:hash", async (req, res) => {
  const tx = await provider.getTransaction(req.params.hash);
  const receipt = await provider.getTransactionReceipt(req.params.hash);
  res.json({ tx, receipt });
});

module.exports = router;
