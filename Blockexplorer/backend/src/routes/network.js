const express = require("express");
const provider = require("../provider");

const router = express.Router();

router.get("/", async (req, res) => {
  const network = await provider.getNetwork();
  const blockNumber = await provider.getBlockNumber();

  res.json({
    chainId: Number(network.chainId),
    blockNumber,
    name: "Local Clique PoA"
  });
});

module.exports = router;
