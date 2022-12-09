const mongoose =  require("mongoose");
const mongoConnectionString = "mongodb://127.0.0.1:27017/tasktracker";

module.exports= async()=>{
    await mongoose.connect(mongoConnectionString,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    return mongoose;
}
