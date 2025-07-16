const express = require('express');
const User = require('./models/user');
const connectDB = require('./config/database');
const app = express();

app.use(express.json());

app.post('/signup', async (req, res, next) => {
	// const userObj = {
	// 	firstName: 'Pranav',
	// 	lastName: 'Mudholkar',
	// 	emailId: 'pranavmudholkar455@gmail.com',
	// 	password: 'pranav@123',
	// };

	//Creating an instance of the user model using the userObj.
	// const user = new User(userObj);

	// Creating an instance of the user model by passing the obj directly as an argument
	// const user = new User({
	// 	firstName: 'MS',
	// 	lastName: 'Dhoni',
	// 	emailId: 'MSDhoni@gmail.com',
	// 	password: 'Dhoni@777',
	// });

	const user = new User(req.body);
	try {
		await user.save();

		res.send('User added successfully');
	} catch {
		res.status(400).send('Error saving the user: ' + err.message);
	}
=======
app.use('/', (err, req, res, next) => {
	if (err) {
		res.status(500).send('something went wrong');
	}
});

app.get('/admin/getUserData', (req, res, next) => {
	// try {
	throw new Error('sasdasd');
	res.send('All Data sent');
	// } catch {
	// res.status(500).send('Something went wrong, contact the support team');
	// }
});

app.use('/', (err, req, res, next) => {
	if (err) {
		res.status(500).send('something went wrong');
	}
});
app.listen(3000, () => {
	console.log('Hi From the port 3000');

});

//We calling connect DB first becaause we should always connect to the DB before we start listening to the incoming requests on the server.
connectDB()
	.then(() => {
		console.log('Database connection established');

		app.listen(7777, () => {
			console.log('Hi From the port 7777');
		});
	})
	.catch((err) => {
		console.log('Database connection could not be established');
	});
