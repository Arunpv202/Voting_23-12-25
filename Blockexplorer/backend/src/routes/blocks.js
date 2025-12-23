const express = require("express");
const provider = require("../provider");

const router = express.Router();

router.get("/", async (req, res) => {
  const latest = await provider.getBlockNumber();
  const blocks = [];

  for (let i = latest; i > latest - 10 && i >= 0; i--) {
    const block = await provider.getBlock(i);
    blocks.push({
      number: block.number,
      hash: block.hash,
      // miner field removed
      txCount: block.transactions.length,
      timestamp: block.timestamp,
      transactions: block.transactions
    });
  }

  res.json(blocks);
});

router.get("/recent", async (req, res) => {
  try {
    const latest = await provider.getBlockNumber();
    const blocks = [];
    // Fetch last 6 blocks
    for (let i = latest; i > latest - 6 && i >= 0; i--) {
      const block = await provider.getBlock(i);
      blocks.push({
        number: block.number,
        hash: block.hash,
        timestamp: block.timestamp,
        txCount: block.transactions.length
      });
    }
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:number", async (req, res) => {
  try {
    const query = req.params.number;
    // content passed to getBlock can be a block number (number) or a hash (string)
    // we only convert to Number if it looks like a number and NOT a hex string
    const blockTag = (query.startsWith("0x")) ? query : Number(query);

    const block = await provider.getBlock(blockTag, true);

    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    // Convert to plain object and remove miner
    const blockData = block.toJSON();
    delete blockData.miner;
    res.json(blockData);
  } catch (error) {
    console.error("Error fetching block:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
