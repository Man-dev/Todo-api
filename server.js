var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Meet your friend before lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'Study',
	completed: true
}];

app.get('/', function (req,res) {
	res.send('Todo API Root');
});

app.get('/todos', function (req,res){
	res.json(todos);
});

app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var match;
	todos.forEach(function (todo) {
		if(todo.id===todoId){
			match = todo;
		}
	});
	if(typeof match === 'undefined'){
		res.status(404).send();
	} else {
		res.json(match);
	}
});


app.listen(PORT, function (){
	console.log('Express listening on port '+ PORT + '!');
});