const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    const offersCollection = client.db('goriberSeller').collection('offers');
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
        app.get('/offers', async (req, res) => {
            const query = {}
            const cursor = offersCollection.find(query);
            const offers = await cursor.toArray();
            res.send(offers);
        });
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Goriber Seller Server Running on ${port}`);
})