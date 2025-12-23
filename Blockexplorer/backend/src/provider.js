const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
  "http://localhost:8545"
);

module.exports = provider;
