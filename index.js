const express = require('express')
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//midleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0yove.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const partsCollection = client.db("car_parts").collection("services");
        const orderCollection = client.db("car_parts").collection("orders");

        //get load all data
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = partsCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        //inseart one tools
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await partsCollection.findOne(query)
            res.send(result)
        })
        //add a new tools
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
        //updta a quantity
        app.put("/service/:id", async (req, res) => {
            const id = req.params.id
            const updateQuantity = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: updateQuantity
            }
            const result = await partsCollection.updateOne(filter, updateDoc, options)
            res.send(result)


        })
        //my order
        app.get('/order', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const orders = await orderCollection.find(query).toArray()
            res.send(orders)
        })


    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Car parts!')
})

app.listen(port, () => {
    console.log(`Car Parts app listening on port ${port}`)
})