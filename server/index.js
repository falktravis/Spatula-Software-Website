const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();
var cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);

const PORT = 3301; //process.env.PORT || 3301

//discord.js set up
/*const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.Invites
  ],
});
client.login(process.env.DISCORD_BOT_TOKEN);
console.log(process.env.DISCORD_BOT_TOKEN);*/ //!testing

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

const app = express();

// Custom middleware to save the raw request body for webhooks
app.use((request, response, next) => {
  request.rawBody = '';
  request.on('data', (chunk) => {
    request.rawBody += chunk;
  });
  next();
});

//general middleware
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('/user-data', async (req, res) => {
  try {
    const { userId } = req.query;

    // Retrieve data from MongoDB
    const data = await userDB.findOne({UserId: userId});

    res.json(data); // Send the retrieved data as a JSON response
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const discordId = req.query.discordId;
    const priceId = req.query.priceId;

    let session;
    if(priceId === 'price_1NB6BmK2JasPd9Yue4YiQAhH'){ //price_1NjNhZK2JasPd9Yuf9mGP9Nm
      session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        subscription_data: {
          trial_period_days: 3,
          metadata: {
            discordId: discordId,
          },
        },
        allow_promotion_codes: true,
        success_url: `https://spatulasoftware/Dashboard?success=true`,
        cancel_url: `https://spatulasoftware/Dashboard?canceled=true`,
      });
    }else{
      session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: {
            discordId: discordId,
          },
        },
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: `https://spatulasoftware/Dashboard?success=true`,
        cancel_url: `https://spatulasoftware/Dashboard?canceled=true`,
      });
    }
  
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while creating the Checkout Session.');
  }
});

const endpointSecret = "whsec_VSi8trlRb0lUxE4fKnAbdTNWAa1a3bTW";
//"we_1NqfI2K2JasPd9YuNLO3ALYx"
//"whsec_01e75c99b560466824a03d596993f6fcade9fc1ed151b7f062b113aad1d6740d"

//handle webhooks
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  try {
    //initiate the event
    const sig = request.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);

    //get variables
    const type = event.type; // Type of event
    const customerId = event.data.object.customer; // ID of the customer
    const priceId = event.data.object.items.data[0].price.id; //priceId of the 

    console.log(type);

    if(type === 'customer.subscription.created'){
      console.log('create sub');

      const discordId = event.data.object.metadata.discordId;
      if(priceId === 'price_1NB6BmK2JasPd9Yue4YiQAhH'){//price_1NjNhZK2JasPd9Yuf9mGP9Nm
        await userDB.insertOne({DiscordId: discordId, StripeId: customerId, ConcurrentTasks: 2, MessageAccount: null});
      }else if(priceId === 'price_1NBnrWK2JasPd9Yu8FEcTFDx'){//price_1NjNiMK2JasPd9Yu8sGt7zWM
        await userDB.insertOne({DiscordId: discordId, StripeId: customerId, ConcurrentTasks: 5, MessageAccount: null});
      }else if(priceId === 'price_1NBnrrK2JasPd9YubBtmYjFJ'){//price_1NjNjDK2JasPd9YusTMvOEJ5
        await userDB.insertOne({DiscordId: discordId, StripeId: customerId, ConcurrentTasks: 10, MessageAccount: null});
      }
      
    }else if(type === 'customer.subscription.updated'){
      console.log("update sub tier");

      //delete user from db
      //await userDB.deleteOne({StripeId: customerId});

      if(priceId === 'price_1NB6BmK2JasPd9Yue4YiQAhH'){//price_1NjNhZK2JasPd9Yuf9mGP9Nm
        await userDB.updateOne({StripeId: customerId}, {ConcurrentTasks: 2})
      }else if(priceId === 'price_1NBnrWK2JasPd9Yu8FEcTFDx'){//price_1NjNiMK2JasPd9Yu8sGt7zWM
        await userDB.updateOne({StripeId: customerId}, {ConcurrentTasks: 5})
      }else if(priceId === 'price_1NBnrrK2JasPd9YubBtmYjFJ'){//price_1NjNjDK2JasPd9YusTMvOEJ5
        await userDB.updateOne({StripeId: customerId}, {ConcurrentTasks: 10})
      }
    }else if(type === 'customer.subscription.deleted'){
      console.log('delete sub');
      //delete database user
      await userDB.deleteOne({StripeId: customerId});
    }
    
    // Return a 200 response to acknowledge receipt of the event
    response.sendStatus(200);
  } catch (err) {
    console.log('error: ' + err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
});

//serve the page
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});
