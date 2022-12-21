//const https = require('https');
var fs = require('fs');
const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
var cron = require('node-cron');
//
const app = express();
const port = 8888;
const user = require('./routes/user');
const notification = require('./controllers/notification');
//


//cron job
 cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
  notification.sendReminder();
}); 

cron.schedule('40 59 * * * *', () => {
  console.log('running a task every hour');
  notification.sendPriorityEmail('High');
});

cron.schedule('0 */2 * * *', () => {
  console.log('running a task every 2nd hour');
  notification.sendPriorityEmail('Medium');
});

cron.schedule('0 */3 * * *', () => {
  console.log('running a task every 3rd hour');
  notification.sendPriorityEmail('Low');
});


//Set views folder & Templating Engine
app.set('views',`${__dirname}/public/views`);
app.set('view engine','mustache');
app.engine('mustache',mustacheExpress());
//

//Set public folder
app.use(express.static(path.join(__dirname,'public')));

//Body parser middleware
app.use(bodyParser.json());
app.use( bodyParser.urlencoded({extended:false}));


//Https Server
//* To Create a Https server un comment the below line*/
/*
const options = {
  port:8000,
  key: fs.readFileSync(__dirname+'/certs/key.pem'),
  cert: fs.readFileSync(__dirname+'/certs/cert.pem'),
  passphrase: "******"
};
//https.createServer(options, app).listen(port);
*/

//Http Server
//*This line starts a http server with the specified port*/
//By Defaul this is http

//Enable Cors/Cross-Origin requests
app.use(cors());

//Config routes
app.use('/task',user);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

