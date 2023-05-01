const express = require("express");
const path = require('path');
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 3301;

//middleware (as if I know what that means)
const app = express();
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//handle webhooks
app.post("/webhook", (req, res) => { //!Webhooks wont work on local server
  console.log(req.body)
  res.status(200).end()
})

//serve the page
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});
