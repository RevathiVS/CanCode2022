# MongoDB setup
create mongodb collection
mongoConnectionString = "mongodb://127.0.0.1:27017/tasktracker"

# POST endpoint
http://localhost:8888/task

# Sample post method:
var data={
"x-app-env":"prod",
"userId":"user01",
"userName":"User One"
}
Fetch('http://localhost:8888/task/addtask',{
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



