var express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const mongo = require('./mongo');
const mongoUserSchema = require('../models/user');
const mustache = require('mustache');

router.get('/',async (req,res)=>{
    res.render('index');
});

router.post('/addtask',(req,res)=>{
    var data = req.body;
    console.log("In Post Method, data=%j",data);
    insertToUserDb(data);
    res.json({message:'success'});
});

router.get('/getUserDetailsById/:userId',async (req,res)=>{
    var userId = req.params.userId;
    var dbResult = await fetchRecordByUserId({userId : userId});
    console.log("Returned to GET%j",dbResult)
    res.json({message:'success',data:dbResult});
});

router.get('/getTaskDetailsByDate/:date',async (req,res)=>{
    var date = req.params.date;
    var dbResult = await fetchRecordByUserId({date : date});
    console.log("Returned to GET%j",dbResult)
    res.json({message:'success',data:dbResult});
});

router.post('/addUser',(req,res)=>{
    console.log("In Post Method"+req.body["x-app-env"]);
    var data = req.body;
    data.environment = req.body["x-app-env"];
    data.userId = req.body["userId"];
    data.userName = req.body["userName"];
    data.currentDateTime = (new Date().toISOString()).split("T")[0]
    console.log("In Post Method, data=%j",data);
    insertToUserDb(data);
    res.json({message:'success'});
});

// DB CRUD Methods
const insertToUserDb = async (data) =>{
await mongo().then(async (mongoose)=>{
    try{
        console.log("connected to MongoDB");
        console.log("data=%j",data);
        await new mongoUserSchema(data).save();
        console.log("Data inserted to mongo DB Successfully");
    }finally{
        mongoose.connection.close();
    }
})
}

const upsertToUserDb = async (searchQuery,upsertData) =>{
    await mongo().then(async (mongoose)=>{
        try{
            console.log("connected to MongoDB");
            await mongoUserSchema.findOneAndUpdate({"userId" : "user01"},upsertData,{upsert: true});
            console.log("Data Updated to mongo DB Successfully");
        }catch(e){
            console.log("Exception = "+e.message);
        }finally{
            mongoose.connection.close();
        }
    })
    }

const fetchRecordByUserId = async (searchParameter) =>{
    var dbResult="NONE";
    await mongo().then(async (mongoose)=>{
        
        try{
            console.log("connected to MongoDB");
            console.log(searchParameter);
            await mongoUserSchema.find(searchParameter).then( (docs)=> {
                //console.log("First function call : ", docs);
                dbResult = docs;
            });
            console.log("Data retrieved to mongo DB Successfully");
        }catch(e){
            console.log("Exception in DB Find "+e.message);
        }finally{
            console.log("closing db connection");
            mongoose.connection.close();
        }
    })
console.log("Returning dbRes,%j",dbResult);
    return dbResult;
    
    }


module.exports = router