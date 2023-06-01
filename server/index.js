const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();
var cors = require('cors');
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
    console.log(userId);

    // Retrieve data from MongoDB
    const data = await userDB.findOne({UserId: userId});
    console.log(data);

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
    if(priceId === 'price_1NB6BmK2JasPd9Yue4YiQAhH'){
      session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        subscription_data: {
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'cancel',
            },
          },
          trial_period_days: 3,
        },
        metadata: {
          discordUserId: discordId
        },
        payment_method_collection: 'if_required',
        success_url: `http://localhost:3301/Dashboard?success=true`,
        cancel_url: `http://localhost:3301/Dashboard?canceled=true`,
      });
    }else{
      session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        metadata: {
          discordUserId: discordId
        },
        success_url: `http://localhost:3301/Dashboard?success=true`,
        cancel_url: `http://localhost:3301/Dashboard?canceled=true`,
      });
    }
  
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while creating the Checkout Session.');
  }
});

const endpointSecret = "whsec_01e75c99b560466824a03d596993f6fcade9fc1ed151b7f062b113aad1d6740d";

//handle webhooks
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  try {
    //initiate the event
    const sig = request.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);

    //get variables
    const type = event.type; // Type of event
    const customerId = event.data.object.customer; // ID of the customer
    const status = event.data.object.status; // Action/status related to the event
    const priceId = event.data.object.items.data[0].price.id; //priceId of the 

    //get the discord id of the user
    const discordId = request.body.data.object.metadata.discordUserId;

    console.log(type);

    if(type === 'customer.subscription.created'){
      console.log('create sub');
      if(priceId === 'price_1NB6BmK2JasPd9Yue4YiQAhH'){
        await userDB.insertOne({DiscordId: discordId, StripeId: customerId, ConcurrentTasks: 5});
      }else if(priceId === 'price_1NBnrWK2JasPd9Yu8FEcTFDx'){
        await userDB.insertOne({DiscordId: discordId, StripeId: customerId, ConcurrentTasks: 10});
      }else if(priceId === 'price_1NBnrrK2JasPd9YubBtmYjFJ'){
        await userDB.insertOne({DiscordId: discordId, StripeId: customerId, ConcurrentTasks: 20});
      }
      
    }else if(type === 'customer.subscription.updated'){

      //Check for trial end with no payment method
      const customer = await stripe.customers.retrieve(customerId); //get customer from stripe
      const defaultPaymentMethod = customer.invoice_settings.default_payment_method;
      if (status === 'active' && defaultPaymentMethod === null) {
        console.log('Trial period ended without payment information');

      }else{//update the subscription tier
        console.log("update sub tier");

        //delete user from db
        await userDB.deleteOne({StripeId: customerId});

        //message main app to delete from the map, or not?


        if(priceId === 'price_1NB6BmK2JasPd9Yue4YiQAhH'){
          await userDB.updateOne({StripeId: customerId}, {ConcurrentTasks: 5})
        }else if(priceId === 'price_1NBnrWK2JasPd9Yu8FEcTFDx'){
          await userDB.updateOne({StripeId: customerId}, {ConcurrentTasks: 10})
        }else if(priceId === 'price_1NBnrrK2JasPd9YubBtmYjFJ'){
          await userDB.updateOne({StripeId: customerId}, {ConcurrentTasks: 20})
        }
      }
    }else if(type === 'customer.subscription.deleted'){
      console.log('delete sub');
      //delete database user
      await userDB.deleteOne({StripeId: customerId});

      //message main script to delete user from map, or not?

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
