const express = require("express");
const cors = require("cors");

const blocks = require("./routes/blocks");
const tx = require("./routes/tx");
const address = require("./routes/address");
const network = require("./routes/network");

const app = express();
app.use(cors());

app.use("/network", network);
app.use("/blocks", blocks);
app.use("/tx", tx);
app.use("/address", address);

app.listen(4000, () => {
  console.log("Explorer backend running on http://localhost:4000");
});
