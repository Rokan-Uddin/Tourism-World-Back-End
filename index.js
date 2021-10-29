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
        const tropicalVacationCollection = database.collection("tropical_vacation");


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
        // api for update confirmed package status 
        app.put('/mypackage',async(req,res)=>{
            let statusValue;
            if(req.query.status=="true") statusValue=false;
            else statusValue=true;
            const filter = { _id: ObjectId(req.query.id) };
            const options = { upsert: true };
            const updateDoc = {
              $set: {
                status:statusValue
              },
            };
            const result = await touristInformationCollection.updateOne(filter, updateDoc, options);
            res.json(result)
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
        app.post('/add',async(req,res)=>{
            const newPackage=req.body;
            const result = await packageCollection.insertOne(newPackage);
            res.json(result)
        })

        // tropical vacation api 
        app.get('/vacations', async(req,res)=>{
            const cursor= tropicalVacationCollection.find({})
            const vacations=await cursor.toArray();
            res.json(vacations)
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