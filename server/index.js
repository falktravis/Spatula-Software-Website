const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();
var cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const PORT = 3301; //process.env.PORT || 3301

//discord.js set up
const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
});
client.login(process.env.DISCORD_BOT_TOKEN);
const { ViewChannel, UseApplicationCommands } = PermissionFlagsBits;

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

let guild;
let commandsCategory;
let welcomeChannel;
client.on('ready', async () => {
  try {
    guild = await client.guilds.fetch('1079829593705422978');

    welcomeChannel = guild.channels.cache.get("1086899588545392712");
    if(welcomeChannel == null){
      welcomeChannel = await guild.channels.fetch('1086899588545392712');
    }

    commandsCategory = guild.channels.cache.get("1154099395399258142");
    if(commandsCategory == null){
      commandsCategory = await guild.channels.fetch('1154099395399258142');
    }
  } catch (error) {
    console.log(error);
  }
})

//create command channel
client.on('guildMemberAdd', async (member) => {
  try {  
    const userObj = await userDB.findOne({UserId: member.user.id});
    if(userObj != null){
      if(userObj.ConcurrentTasks == 2){
        member.roles.add('1154922101808042094');
      }else if(userObj.ConcurrentTasks == 5){
        member.roles.add('1154921995943813160');
      }else if(userObj.ConcurrentTasks == 10){
        member.roles.add('1154921822576459806');
      }

      //create private channel in discord
      guild.channels.create({
        name: member.user.username,
        type: ChannelType.GuildText,
        parent: commandsCategory,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [ViewChannel]
          },
          {
            id: member.user.id,
            allow: [ViewChannel, UseApplicationCommands]
          },
          {
            id: '1154107647197458596',
            allow: [ViewChannel]
          }
        ]
      });
    }
  } catch (error) {
    console.log(error);
  }
});

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
    if(priceId === 'price_1NjNhZK2JasPd9Yuf9mGP9Nm'){ //price_1NB6BmK2JasPd9Yue4YiQAhH
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
        success_url: `https://spatulasoftware.com/Success`,
        cancel_url: `https://spatulasoftware.com/Dashboard`,
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
        success_url: `https://spatulasoftware.com/Success`,
        cancel_url: `https://spatulasoftware.com/Dashboard`,
      });
    }
  
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while creating the Checkout Session.');
  }
});

const endpointSecret = "whsec_qI9loZC6tGxiptOCno7xswL35VmDcoey";//whsec_VSi8trlRb0lUxE4fKnAbdTNWAa1a3bTW

//handle webhooks
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  try {
    //initiate the event
    const sig = request.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);

    //get variables
    const type = event.type; // Type of event
    console.log(type);

    if(type === 'customer.subscription.created' || type === 'customer.subscription.updated' || type === 'customer.subscription.deleted'){
      const customerId = event.data.object.customer; // ID of the customer
      const priceId = event.data.object.items.data[0].price.id; //priceId of the 

      if(type === 'customer.subscription.created'){
        console.log('create sub');
        const discordId = event.data.object.metadata.discordId;

        if(priceId === 'price_1NjNhZK2JasPd9Yuf9mGP9Nm'){//price_1NB6BmK2JasPd9Yue4YiQAhH
          await userDB.insertOne({UserId: discordId, StripeId: customerId, ConcurrentTasks: 2, MessageAccount: null});
        }else if(priceId === 'price_1NjNiMK2JasPd9Yu8sGt7zWM'){//price_1NBnrWK2JasPd9Yu8FEcTFDx
          await userDB.insertOne({UserId: discordId, StripeId: customerId, ConcurrentTasks: 5, MessageAccount: null});
        }else if(priceId === 'price_1NjNjDK2JasPd9YusTMvOEJ5'){//price_1NBnrrK2JasPd9YubBtmYjFJ
          await userDB.insertOne({UserId: discordId, StripeId: customerId, ConcurrentTasks: 10, MessageAccount: null});
        }

        //if user is in the guild already
        const member = await guild.members.fetch(discordId);
        if(member){
          guild.channels.create({
            name: member.user.username,
            type: ChannelType.GuildText,
            parent: commandsCategory,
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: [ViewChannel]
              },
              {
                id: member.user.id,
                allow: [ViewChannel]
              },
              {
                id: '1154107647197458596',
                allow: [ViewChannel]
              }
            ]
          });

          if(priceId === 'price_1NjNhZK2JasPd9Yuf9mGP9Nm'){
            await member.roles.add('1154922101808042094');
          }else if(priceId === 'price_1NjNiMK2JasPd9Yu8sGt7zWM'){
            await member.roles.add('1154921995943813160');
          }else if(priceId === 'price_1NjNjDK2JasPd9YusTMvOEJ5'){
            await member.roles.add('1154921822576459806');
          }
        }
      }else if(type === 'customer.subscription.updated'){
        console.log("update sub tier");

        if(priceId === 'price_1NjNhZK2JasPd9Yuf9mGP9Nm'){//price_1NB6BmK2JasPd9Yue4YiQAhH
          await userDB.updateOne({StripeId: customerId}, {$set: {ConcurrentTasks: 2}});
        }else if(priceId === 'price_1NjNiMK2JasPd9Yu8sGt7zWM'){//price_1NBnrWK2JasPd9Yu8FEcTFDx
          await userDB.updateOne({StripeId: customerId}, {$set: {ConcurrentTasks: 5}});
        }else if(priceId === 'price_1NjNjDK2JasPd9YusTMvOEJ5'){//price_1NBnrrK2JasPd9YubBtmYjFJ
          await userDB.updateOne({StripeId: customerId}, {$set: {ConcurrentTasks: 10}});
        }
      }else if(type === 'customer.subscription.deleted'){
        console.log('delete sub');
        
        //get db obj for the discord id
        const userObj = userDB.findOne({StripeId: customerId});

        //delete database user
        await userDB.deleteOne({StripeId: customerId});

        //remove the user from discord server
        const user = await client.users.fetch(userObj.UserId);
        //!await guild.members.kick(user);

        //TODO: delete private channel
        
      }
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
