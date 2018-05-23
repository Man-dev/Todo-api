var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;


var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.trim().length > 0) {
		where.description = {
			$like: '%' + query.q.trim().toLowerCase() + '%'
		}
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var todos = db.todo;
	todos.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo);
		} else {
			res.status(404).json('couldn\'t find requested id.');
		}
	}, function(e) {
		res.json(e);
	});
});


app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var todos = db.todo;

	todos.create(body).then(function(todo) {
		res.json(todo);
	}, function(e) {
		res.send(400).json(e);
	});
});

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			todo.destroy().then(function() {
				res.json({
					"Deleted Item": todo
				});
			});
		} else {
			res.json("Couldn\'t find any item by that id.");
		}
	})
});

app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	todoId = parseInt(req.params.id, 10);
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		todo.update(attributes).then(function(todo) {
			res.json(todo.toJSON());
		}, function (e) {
			res.status(400).json(e);
		});
	}, function() {
		res.status(404).send();
	});

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});