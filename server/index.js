const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3301;

app.use(cors());

//serve the react site with backend
app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
})

//listen on a port, using environment variables for cloud server providers
app.listen(PORT, () => {
    console.log("listening on port 3301");
})