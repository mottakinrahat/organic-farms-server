const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yimfqcp.mongodb.net/?retryWrites=true&w=majority`;

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


    const personalCollection = client.db('organicFarmers').collection('personalInfo');
    const cropsCollection = client.db('organicFarmers').collection('crops');
    const productCollection = client.db('organicFarmers').collection('product');

    app.post('/personalInfo', async (req, res) => {
      const body = req.body;
      const result = await personalCollection.insertOne(body);
      res.send(result);
    });
    app.post('/crops', async (req, res) => {
      const body = req.body;
      const result = await cropsCollection.insertOne(body);
      res.send(result);
    });
    app.get('/crops', async (req, res) => {
      const cursor = cropsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/crops/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cropsCollection.findOne(query);
      res.send(result);
    });
    app.put('/crops/:id', async (req, res) => {
      const id = req.params.id;
      const crops = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCrops = {
        $set: {

          productName: crops.productName,
          ProductImage: crops.ProductImage,
          quantity: crops.quantity,
          subcategory: crops.subcategory,
          price: crops.price,
          Variety: crops.Variety
        },
      };
      const result = await cropsCollection.updateOne(filter, updateCrops, options);
      res.send(result);
    });
    app.put('/personalInfo/:id', async (req, res) => {
      const id = req.params.id;
      const profileInfo = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCrops = {
        $set: {


          nameOfBusiness: profileInfo.nameOfBusiness,
          number: profileInfo.number,
          DateOfFoundation: profileInfo.DateOfFoundation,
          TurnOver: profileInfo.TurnOver,
          areaOfFarm: profileInfo.areaOfFarm,
          location: profileInfo.location,
          photo: profileInfo.photo,
          nameOf: profileInfo.nameOf

        },
      };
      const result = await personalCollection.updateOne(filter, updateCrops, options);
      res.send(result);
    });
    app.delete('/crops/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cropsCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    app.get('/personalInfo', async (req, res) => {
      const cursor = personalCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/personalInfo/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await personalCollection.findOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('organicFarmer is running ');
});

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});