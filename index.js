
const express = require("express")
const cors = require("cors")
const port = process.env.PORT || 3000
const app = express()

// middleware
app.use(cors())
app.use(express.json())

// car-service
// 4EGrNlaKv773bRdT


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://car-service:4EGrNlaKv773bRdT@cluster0.kndeci6.mongodb.net/?retryWrites=true&w=majority";

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
    // await client.connect();

    const serviceCollection = client.db("carServiceDB").collection("services")

    const carServicesCartCollection = client.db("carServiceDB").collection("carCart")

    // read (display services data)
    app.get("/servicesData", async (req, res) => {
      const cursor = serviceCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // read (services data details)
    app.get("/servicesData/:id", async (req, res) => {
      const id = req.params.id
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })

    // create (add services data )
    app.post("/servicesData", async (req, res) => {
      const newService = req.body
      const result = await serviceCollection.insertOne(newService)
      console.log(newService);
      console.log(result);
      res.send(result)
    })

    // start(cart)
    // read(my cart )

    app.get("/cart/:email", async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const cursor=carServicesCartCollection.find(query)
      const result=await cursor.toArray()
      res.send(result)
    })


    // create (add to cart)
    app.post("/cart", async (req, res) => {
      const newCart = req.body
      const result = await carServicesCartCollection.insertOne(newCart)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Car service server is running...")
})

app.listen(port, (req, res) => {
  console.log(`port${port}`);
})