const express = require('express');
const User = require('./models/user');
const connectDB = require('./config/database');
const validator = require('validator');
const { validateSignUpData } = require('./utils/validation');
const app = express();
const bcrypt = require('bcrypt');

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

	//---------------------------------------------------------------------------------------------------------------------------------------
	try {
		//validation of data
		validateSignUpData(req);
		//encrypt the password

		const { firstName, lastName, emailId, password } = req.body;

		console.log(password);

		const passwordHash = await bcrypt.hash(password, 10);

		console.log(passwordHash);
		//create a new instance of the User

		const user = new User({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		});

		await user.save();

		res.send('User added successfuly');
	} catch (err) {
		res.status(400).send('ERROR: ' + err.message);
	}
});

app.post('/login', async (req, res) => {
	try {
		const { emailId, password } = req.body;
		if (!validator.isEmail(emailId)) {
			throw new Error('Ivalid Credentials');
		}
		const user = await User.findOne({ emailId: emailId });
		if (!user) {
			throw new Error('Ivalid Credentials');
		}
		const isPassowrdValid = await bcrypt.compare(password, user.password);

		if (isPassowrdValid) res.send('Login successful');
		else throw new Error('Login unsuccessful');
	} catch (err) {
		res.status(400).send('ERROR: ' + err.message);
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

app.delete('/user', async (req, res) => {
	const userId = req.body.userId;
	try {
		const user = await User.findByIdAndDelete(userId);
		res.status(200).send('User deleted successfuly');
	} catch (err) {
		res.status(404).send('something went wrong');
	}
});

app.patch('/user/:userId', async (req, res) => {
	const data = req.body;
	const userId = req.params.userId;
	try {
		const ALLOWED_UPDATES = ['photoURL', 'skills', 'age', 'gender', 'about'];
		const isUpdateAllowed = Object.keys(data).every((k) =>
			ALLOWED_UPDATES.includes(k)
		);
		if (!isUpdateAllowed) {
			throw new Error('Update is not allowed.');
		}
		const user = await User.findByIdAndUpdate({ _id: userId }, data, {
			returnDocument: 'before',
		});
		res.status(200).send('User updated successfuly');
	} catch (err) {
		res.status(404).send('something went wrong');
	}
});

// app.patch('/user', async (req, res) => {
// 	const data = req.body;
// 	console.log(data);
// 	const email = req.body.emailId;
// 	console.log(email);
// 	try {

// 		await User.findOneAndUpdate({ emailId: email }, data);
// 		res.status(200).send('User updated successfuly');
// 	} catch {
// 		res.status(404).send('something went wrong');
// 	}
// });

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
