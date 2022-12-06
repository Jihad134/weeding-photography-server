const express=require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const cors=require('cors')
require('dotenv').config()
const port=process.env.PORT || 5000
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster0.6doajke.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection=client.db("weeding").collection('service')
        const orderCollection=client.db("weeding").collection('order')
        app.get('/reviews',async(req,res)=>{
            let query={}
            if(req.query.service){
                query={
                    service:req.query.service
                }
            }
            const cursor= await orderCollection.find(query)
            const result= await cursor.toArray();
            res.send(result)
        })
        app.get('/reviews/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await orderCollection.findOne(query)
            res.send(result)
        })
        app.get("/order",async(req,res)=>{
            let query={}
            if(req.query.email){
                query={
                    email:req.query.email
                }
            }
            const cursor= orderCollection.find(query)
            const order=await cursor.toArray()
            res.send(order)
        })
        app.post('/review',async(req,res)=>{
            const order=req.body
            const result=await orderCollection.insertOne(order) 
            res.send(result)
        })
        app.delete('/review/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await orderCollection.deleteOne(query)
            res.send(result)
        })
        app.put("/review/:id",async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const user =req.body
            const option={upsert:true}
            const userUpdate={
                $set:{
                    message:user.message,
                }
            }
            const result=await orderCollection.updateOne(query,userUpdate,option)
            res.send(result)
        })
        app.post("/jwt",(req,res)=>{
            const user=req.body
            const token=jwt.sign(user,process.env.SECREAT_TOKEN,{expiresIn:'1h'})
            
            res.send(token)
        })
        console.log(process.env.SECREAT_TOKEN)
        app.get("/service",async(req,res)=>{
            const query={}
            const cursor=serviceCollection.find(query).limit(3)
            const result=await cursor.toArray()
            res.send(result)
        })
        app.post("/service",async(req,res)=>{
            const user=req.body
            const result=await serviceCollection.insertOne(user)
            res.send(result)
        })
        app.get('/serviceAll/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await serviceCollection.findOne(query)
            res.send(result)
        })
        app.get("/serviceAll",async(req,res)=>{
            const query={}
            const cursor=serviceCollection.find(query)
            const result=await cursor.toArray()
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(err=>console.error(err))

app.get('/',(req,res)=>{
    res.send('server is running')
})
app.listen(port,()=>{
    console.log(`server is running ${port}`)
})