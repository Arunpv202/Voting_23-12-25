const express = require("express");
const { ethers } = require("ethers");
const provider = require("../provider");

const router = express.Router();

router.get("/:addr", async (req, res) => {
  const balance = await provider.getBalance(req.params.addr);

  res.json({
    address: req.params.addr,
    balance: ethers.formatEther(balance)
  });
});

module.exports = router;
