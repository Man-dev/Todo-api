var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: 'sqlite',
	storage: __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});


// Todo.finadAll({
// 	where: {
// 		id: [1]
// 	}
// }).then(function(todo) {
// 	console.log(todo.toJSON());
// });



sequelize.sync().then(function() {
	console.log('Everything is synced');


	Todo.findById(1).then(function(todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Not found anything related to that id.');
		}
	});


	// 	Todo.findById(2).then(function(todo) {
	// 		if (todo) {
	// 			console.log(todo.toJSON());
	// 		}
	// 	}).catch(function(e) {
	// 		console.log(e.message);
	// 	});
	// Todo.create({
	// 	description: "Walk your dog",
	// 	completed: false
	// }).then(function (todo) {
	// 	console.log('Finished');
	// 	console.log(todo);
	// }).catch(function (e) {
	// 	console.log(e.message);
	// });
});