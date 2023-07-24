const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cors())



//MongoDB
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jvbgqui.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("CollegeBooking").collection("users");
    const collegeCollection = client.db("CollegeBooking").collection("collegeData");
    const admissionCollection = client.db("CollegeBooking").collection("admission");

    //UserData
    app.post('/users',async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //collegeData
    app.get('/college',async (req,res)=>{
      const result = await collegeCollection.find().toArray();
      res.send(result);
    })

    app.get('/college/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await collegeCollection.findOne(query);
      res.send(result);
  })

  //admission
  app.post('/admission', async (req, res) => {
    const admission = req.body;
    console.log(admission);
    const result = await admissionCollection.insertOne(admission);
    res.send(result);
  });

  app.get('/admission',async (req,res)=>{
    const result = await admissionCollection.find().toArray();
    res.send(result);
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('College Booking')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})