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
	var queryParams = req.query;
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos,{completed:true });
	} else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos,{completed:false });
	}

	res.json(filteredTodos);
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

app.put('/todos/:id', function (req,res) {
	var body = _.pick(req.body,'description','completed');
	todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos,{id:todoId})

	if(!matchedTodo){
		return res.status(404).send();
	}

	var validAttributes = {};
	
	if(body.hasOwnProperty('completed')&&_.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')){
		res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length>0){
		validAttributes.description = body.description
	} else if(body.hasOwnProperty('description')){
		res.status(400).send();
	}

	_.extend(matchedTodo,validAttributes);
	res.json(matchedTodo);

});



app.listen(PORT, function (){
	console.log('Express listening on port '+ PORT + '!');
});