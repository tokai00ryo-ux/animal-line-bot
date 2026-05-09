const express = require("express");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {

  const events = req.body.events;

  console.log(events);

  res.sendStatus(200);

});

app.get("/", (req, res) => {
  res.send("LINE BOT OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
