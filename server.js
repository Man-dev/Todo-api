var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;


var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req,res) {
	res.send('Todo API Root');
});

app.get('/todos', function (req,res){
	res.json(todos);
});

app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var match = _.findWhere(todos,{id:todoId});
	// todos.forEach(function (todo) {
	// 	if(todo.id===todoId){
	// 		match = todo;
	// 	}
	// });
	if(typeof match === 'undefined'){
		res.status(404).send();
	} else {
		res.json(match);
	}
});


app.post('/todos', function (req,res) {
	var body = req.body;
	body = _.pick(body,	'description','completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length===0){
		res.status(404).send();
	} else {
		body.description = body.description.trim();
		body.id = todoNextId++;
		todos.push(body);
		res.json(body);
	}
});

app.delete('/todos/:id', function (req,res){
	var todoId = parseInt(req.params.id,10);
	var match = _.findWhere(todos,{id:todoId});
	if(!match){
		res.status(404).json({"error": "no todo found with that id"});
	}else{
		todos = _.without(todos,match);
		res.json(match);
	}
	
});





app.listen(PORT, function (){
	console.log('Express listening on port '+ PORT + '!');
});