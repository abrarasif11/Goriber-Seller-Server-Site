const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// Middle Wares //
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Goriber Seller Site Server is Running')
})

//Mongo DB connection //
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vhdpi0m.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//MongoDB Collection //
async function run() {
    const categoryCollection = client.db('goriberSeller').collection('category');
    const allcategoriesCollection = client.db('goriberSeller').collection('allcategories');
    const ordersCollection = client.db('goriberSeller').collection('orders');
    const itemsCollection = client.db('goriberSeller').collection('items');
    try {
        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });

        app.get('/allcategories', async (req, res) => {
            const query = {}
            const cursor = allcategoriesCollection.find(query);
            const allcategories = await cursor.toArray();
            res.send(allcategories);
        });
        app.get("/categories/:id", async (req, res) => {
            const id = req.params.id;
            const query = {};
            const cursor = await allcategoriesCollection.find(query).toArray();
            const categories = cursor.filter((n) => n.category_id === id);
            res.send(categories);
          });
          app.post('/orders' , async(req, res) => {
            const order = req.body
            console.log(order);
            const result = await ordersCollection.insertOne(order);
            res.send(result);
          });

          //Modal data //
          app.get("/items", async (req, res) => {
            const query = {};
            const cursor = await itemsCollection.find(query);
            const reviews = await cursor.toArray();
            const reverseArray = reviews.reverse();
            res.send(reverseArray);
        });

        app.post("/items", async (req, res) => {
            const items = req.body;
            const result = await itemsCollection.insertOne(items);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Goriber Seller Server Running on ${port}`);
})