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
});

app.get('/user', async (req, res) => {
	try {
		const user = await User.findOne({
			emailId: req.body.emailId,
		});
		if (!user) res.status(404).send('user not found');
		else res.send(user);
		// const users = await User.find({
		// 	emailId: req.body.emailId,
		// });
		// if (users.length === 0) {
		// 	res.status(404).send('user not found');
		// } else {
		// 	res.send(users);
		// }
	} catch (err) {
		res.status(404).send('something went wrong');
	}
});

app.get('/feed', async (req, res) => {
	try {
		const users = await User.find();
		if (users.length === 0) {
			res.status(404).send('Data not found');
		} else {
			res.send(users);
		}
	} catch (err) {
		res.status(404).send('something went wrong');
	}
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
