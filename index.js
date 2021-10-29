const express =require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors= require('cors')
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

const app= express()

//middlewire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zf2qb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        // connect database 
        await client.connect()
        const database = client.db("our_world")
        const packageCollection = database.collection("package")
        const touristInformationCollection = database.collection("touristInformation")
        // package get api 
        app.get('/package', async(req,res)=>{
            const cursor= packageCollection.find({})
            const packages=await cursor.toArray();
            res.json(packages)
        })
        // package get api using _id 
        app.get('/package/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packageCollection.findOne(query);
            res.json(package);
        })
        //add package api
        app.post('/package',async(req,res)=>{
            const touristInformation = req.body;
            const result = await touristInformationCollection.insertOne(touristInformation);
            res.json(result)
        })
        app.post('/mypackage',async(req,res)=>{
            const email= req.query.email;
            const cursor= touristInformationCollection.find({email})
            const mypackage= await cursor.toArray();
            res.json(mypackage)
        })
        app.delete('/mypackage',async(req,res)=>{
            const id=req.query.id;
            const result =await touristInformationCollection.deleteOne({_id:ObjectId(id)});
            res.json(result)
        })
        app.get('/allconfirmedpackage',async(req,res)=>{
            const cursor= touristInformationCollection.find({})
            const allconfirmedpackage= await cursor.toArray();
            res.json(allconfirmedpackage)
        })
    }
    finally{

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Running my CRUD Server');
});

app.listen(port,()=>{
    console.log("Server Running at ",port)
})

               // // POST API
                // app.post('/users', async (req, res) => {
                //     const newUser = req.body;
                //     const result = await usersCollection.insertOne(newUser);
                //     console.log('got new user', req.body);
                //     console.log('added user', result);
                //     res.json(result);
                // });
        
                // //UPDATE API
                // app.put('/users/:id', async (req, res) => {
                //     const id = req.params.id;
                //     const updatedUser = req.body;
                //     const filter = { _id: ObjectId(id) };
                //     const options = { upsert: true };
                //     const updateDoc = {
                //         $set: {
                //             name: updatedUser.name,
                //             email: updatedUser.email
                //         },
                //     };
                //     const result = await usersCollection.updateOne(filter, updateDoc, options)
                //     console.log('updating', id)
                //     res.json(result)
                // })
        
                // // DELETE API
                // app.delete('/users/:id', async (req, res) => {
                //     const id = req.params.id;
                //     const query = { _id: ObjectId(id) };
                //     const result = await usersCollection.deleteOne(query);
        
                //     console.log('deleting user with id ', result);
        
                //     res.json(result);
                // })