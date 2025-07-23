const express = require('express');
const requestsRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const cookieParser = require('cookie-parser');
// app.use(express.json());
// app.use(cookieParser());

const User = require('../models/user');

requestsRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
	const user = req.user;
	console.log('Sending a connection request');

	res.send(user.firstName + ' sent the connection request!!');
});

module.exports = requestsRouter;
