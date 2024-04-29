const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5555

// middleware
app.use(cors());
app.use(express.json());


// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y7qgnfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //Create database
    
    const countryCollection = client.db('tourismDB').collection('countryName');


    const touristSpotCollection = client.db('tourismDB').collection('touristSpot');
    const userCollection = client.db('tourismDB').collection('user');

    // --------------------------------------------- API for country ------------------------------------------------

    //create
    app.post('/countryname', async(req, res) => {
      const country = req.body;
      console.log(country);
      const result = await countryCollection.insertOne(country);
      res.send(result);
    })
    //get all country
    app.get('/countryname', async(req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    // --------------------------------------------- API for touristSpot ------------------------------------------------
    //create
    app.post('/tourist-spot', async(req, res) => {
      const touristSpot = req.body;
      console.log(touristSpot);
      const result = await touristSpotCollection.insertOne(touristSpot);
      res.send(result);
    })
    //get all touristSpot
    app.get('/tourist-spot', async(req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // get single touristSpot
    app.get('/tourist-spot/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await touristSpotCollection.findOne(query);
      res.send(result)
    })
    // get single user touristSpot
    app.get('/user/tourist-spots/:email', async(req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result)
    })
    // delete touristSpot
    app.delete('/tourist-spot/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result)
    })
    app.get('/tourist-spot/country/:name', async(req, res) => {
      const countryName = req.params.name;
      console.log(countryName)
      const query = {country_name: countryName};
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result)
    })
//tourist-spot/countryname
//req.params.name
//await touristSpotCollection.find(query).toArray()
    // --------------------------------------------- API for user------------------------------------------------
    //create
    app.post('/user', async(req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })
    //get all users
    app.get('/user', async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // get single user
    app.get('/user/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result)
    })
    // patch or update user last logged in
    app.patch('/user', async(req, res) => {
      const user = req.body;
      const filter = {email: user.email};
      const updateUser = {
        $set: {
          lastLoggedAt: user.lastLoggedAt, 
        }

      }
      const result = await userCollection.updateOne(filter, updateUser);
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Website is running')
})

app.listen(port, () => {
  console.log(`tourism server is running on port ${port}`)
})