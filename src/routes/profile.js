const express = require('express');
const profileRouter = express.Router();

const bcrypt = require('bcrypt');
const User = require('../models/user');
const { userAuth } = require('../middleware/auth');
const {
	validateEditProfileData,
	validateEditPasswordData,
} = require('../utils/validation');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		res.status(400).send('ERROR: ' + err.message);
	}
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
	try {
		if (!validateEditProfileData(req)) throw new Error('Invalid edit details');
		const loggedInUser = req.user;
		Object.keys(req.body).forEach((key) => {
			loggedInUser[key] = req.body[key];
		});
		await loggedInUser.save();
		res.json({
			message: `${loggedInUser.firstName} your profile was updated successful`,
			data: loggedInUser,
		});
	} catch (err) {
		res.status(400).send('ERROR: ' + err.message);
	}
});

//Change password
profileRouter.patch('/profile/password', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		if (!validateEditPasswordData(req))
			throw new Error('Entered Password details are invalid');
		if (req.body.newPassword === req.body.confirmNewPassword) {
			const passwordValid = await bcrypt.compare(
				req.body.newPassword,
				loggedInUser.password
			);
			if (!passwordValid) {
				loggedInUser['password'] = req.body.newPassword;
				await loggedInUser.save();
				res.json({
					message: `${loggedInUser.firstName} your profile was updated successful`,
					data: loggedInUser,
				});
			}
		} else {
			throw new Error('Entered Password details are invalid');
		}
	} catch (err) {
		res.status(400).send('ERROR: ' + err.message);
	}
});

module.exports = profileRouter;
