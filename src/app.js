const express = require('express');
const User = require('./models/user');
const connectDB = require('./config/database');
const validator = require('validator');
const { validateSignUpData } = require('./utils/validation');
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/auth');

app.use(express.json());
app.use(cookieParser());

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

		const passwordHash = await bcrypt.hash(password, 10);

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
		const isPassowrdValid = await user.validatePassword(password);

		if (isPassowrdValid) {
			const token = await user.getJWT();

			res.cookie('token', token, {
				expires: new Date(Date.now() + 8 * 3600000),
			});
			res.send('Login successful');
		} else throw new Error('Login unsuccessful');
	} catch (err) {
		res.status(400).send('ERROR: ' + err.message);
	}
});

app.get('/profile', userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		res.status(404).send('something went wrong');
	}
});

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
	const user = req.user;
	console.log('Sending a connection request');

	res.send(user.firstName + 'sent the connection request!!');
});

// app.patch('/user', async (req, res) => {
// 	const data = req.body;
// 	const email = req.body.emailId;
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
