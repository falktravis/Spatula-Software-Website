const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
var cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);

const PORT = process.env.PORT || 3301;

//Database connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://SpatulaSoftware:jpTANtS4n59oqlam@spatula-software.tyas5mn.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let userDB;
(async () => {
    try {
        await mongoClient.connect();
        await mongoClient.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        userDB = mongoClient.db('Spatula-Software').collection('Users');
    } catch(error){
        await mongoClient.close();
        console.log("Mongo Connection " + error);
    }
})();

//middleware (as if I know what that means)
const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/create-checkout-session', async (req, res) => {
  
  const { priceId } = req.body;
  console.log(priceId);

  try{
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:3301/Dashboard`,
      cancel_url: `http://localhost:3301/Dashboard`,
    });

    console.log(session);

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//handle webhooks
app.post("/webhook", (req, res) => { //!Webhooks wont work on local server
  console.log(req.body);
  
  res.status(200).end();
})

//serve the page
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});
