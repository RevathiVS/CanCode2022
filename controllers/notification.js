const users = require('./users');
const tasks = require('../routes/user');
const nodemailer = require('nodemailer');
const mongo = require('../routes/mongo');
const mongoUserSchema = require('../models/user');
const notificationTemplate = require('../emailTemplates/notification');

async function sendReminder() {
    var userList = Object.keys(users);
    for (let i = 0; i < userList.length; i++) {
        var dbResult = await fetchRecordByUserId({userId:userList[i]});
        console.log(dbResult);
        var currDate = (new Date().toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})).toString().split(' ')[0];
        var currTime = (new Date().toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})).toString().split(' ')[1];
        var currHours = currTime.split(':')[0];
        var currMins = currTime.split(':')[1];
        var taskList="";
        for(let j=0; j<dbResult.length; j++){
            var reminderDate = (new Date(dbResult[j].reminder).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})).toString().split(' ')[0];
           var reminderTime = (new Date(dbResult[j].reminder).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})).toString().split(' ')[1];
           var reminderHours = reminderTime.split(':')[0];
           var reminderMins = reminderTime.split(':')[1];
           if(reminderDate == currDate && reminderHours == currHours && reminderMins == currMins){
            taskList+="<li>"+dbResult[j].taskTitle+"</li>";
             
           }
        }
      if(taskList){
        await sendEmail(userList[i],users[userList[i]],notificationTemplate.getNotificationTemplate(userList[i],taskList));
      }
    }
}
//urgent reminder email
async function sendPriorityEmail(Priority) {
    var userList = Object.keys(users);
    for (let i = 0; i < userList.length; i++) {
        var dbResult = await fetchRecordByUserId({userId:userList[i],priority:Priority});
        //console.log(dbResult);
        var currDate = (new Date().toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})).toString().split(' ')[0];
        var currTime = (new Date().toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})).toString().split(' ')[1];
        var currHours = currTime.split(':')[0];
        var currMins = currTime.split(':')[1];
        var taskList ="";
        
        for(let j=0; j<dbResult.length; j++){
            var reminderDate = (new Date(dbResult[j].reminder).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})).toString().split(' ')[0];
           //var reminderTime = (new Date(dbResult[j].reminder).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})).toString().split(' ')[1];
           //var reminderHours = reminderTime.split(':')[0];
           //var reminderMins = reminderTime.split(':')[1];
           if(reminderDate == currDate){
           taskList+="<li>"+dbResult[j].taskTitle+"</li>";
           console.log(dbResult[j])
           }
           
        }
        if(taskList){
        if(Priority == 'High'){
        await sendEmail(userList[i],users[userList[i]],notificationTemplate.getNotificationTemplate_high(userList[i],taskList));
        }
        }
    }
}

async function sendEmail(userId, emailId, html) {
    //Step 1: Creating the transporter
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "38083626754344",
            pass: "242d2bb2a7c141"
        }
    });

    //Step 2: Setting up message options
    const messageOptions = {
        subject: "Reminder",
        html: ` ${html}`,
        to: emailId,
        from: "TaskTrackerApp@onmicrosoft.com"
    };

    //Step 3: Sending email
    transporter.sendMail(messageOptions);

}

const fetchRecordByUserId = async (searchParameter) =>{
    var dbResult="NONE";
    await mongo().then(async (mongoose)=>{
        console.log(mongoUserSchema.db.host); // localhost
console.log(mongoUserSchema.db.port); // 27017
console.log(mongoUserSchema.db.name);
console.log(mongoUserSchema.collection.collectionName);
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

    module.exports = {sendReminder,sendPriorityEmail}