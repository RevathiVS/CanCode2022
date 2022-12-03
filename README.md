# nodejs-webapp-api-boilerplate
This repo is a holds the boilerplate code to kickstart a nodejs webapp + api  project

# POST endpoint
http://localhost:8000/user/addUser

# Sample post method:
var data={
"x-app-env":"prod",
"userId":"user01",
"userName":"User One"
}
Fetch('http://localhost:8888/user/addUser',{
Method:'post',
body:JSON.stringify(data);
Headers: new Headers({
	'Content-Type':'application/json'
	})
})
.then(res=(res.json()))
.then(data={
console.log(data);
});

# GET Endpoint
http://127.0.0.1:8888/user/getUserDetailsById/user01

# Sample Get Endpoint Response

{"message":"success","data":[{"_id":"6387c4b8718fa367c6f22590","environment":"prod","userId":"user01","userName":"User One","currentDateTime":"2022-11-30","__v":0}]}

