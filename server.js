
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});
 
// connect to database
mc.connect();
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
 
// Retrieve all todos 
app.get('/todos', function (req, res) {
    mc.query('SELECT * FROM user', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos list.' });
    });
});
 
// Search for todos with ‘bug’ in their name
app.get('/todos/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    
	mc.query("SELECT * FROM user WHERE username LIKE ? ", ['%' + keyword + '%'], function (error, results, fields) {       
		console.log(keyword);
	  if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos search list.' });
    });
});
 
// Retrieve todo with id 
app.get('/todo/:id', function (req, res) {
 
    let task_id = req.params.id;
 
    mc.query('SELECT * FROM user where id=?', task_id, function (error, results, fields) {
        if (results == null) {
		return res.send({ message: 'data kosong' });	
		}else{
		return res.send({ data: results[0], message: 'Todos list.' });
		}
        
    });
 
});
 
// Add a new todo  
app.post('/todo', function (req, res) {
 
    let username = req.body.username;
	let password = req.body.password;
    let fullname = req.body.fullname;
	let city = req.body.city;
	let status = req.body.status;
    mc.query("INSERT INTO user SET ? ", { username: username ,password: password,fullname: fullname, city: city,status: status}, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New task has been created successfully.' });
    });
});
 
//  Update todo with id
app.put('/todo', function (req, res) {
 
    let task_id = req.body.task_id;
    let task = req.body.task;
 
    if (!task_id || !task) {
        return res.status(400).send({ error: task, message: 'Please provide task and task_id' });
    }
 
    mc.query("UPDATE user SET task = ? WHERE id = ?", [task, task_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Task has been updated successfully.' });
    });
});
 
//  Delete todo
app.delete('/todo/:id', function (req, res) {
 
    let task_id = req.params.id;
 
    mc.query('DELETE FROM user WHERE id = ?', [task_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Task has been updated successfully.' });
    });
 
});
 
// all other requests redirect to 404
app.all("*", function (req, res, next) {
    return res.send('page not found');
    next();
});
 
// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});
 
// allows "grunt dev" to create a development server with livereload
module.exports = app;