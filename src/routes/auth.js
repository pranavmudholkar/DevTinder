const express = require('express');
const authRouter = express.Router();

const User = require('../models/user');
const { validateSignUpData } = require('../utils/validation');
const validator = require('validator');
const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');
// app.use(express.json());
// app.use(cookieParser());

authRouter.post('/signup', async (req, res, next) => {
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

authRouter.post('/login', async (req, res) => {
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

module.exports = authRouter;
