const express = require('express');
const { userAuth } = require('../middleware/auth');
const userRouter = express.Router();
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SAFEDATA = [
	'firstName',
	'lastName',
	'photoURL',
	'age',
	'skills',
	'about',
];
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequests = await connectionRequest
			.find({
				toUserId: loggedInUser._id,
				status: 'interested',
			})
			//instead of an array it can also be sent as a string seperated by a space after every field.
			//For ex: 'firstName lastName'
			.populate('fromUserId', USER_SAFEDATA);

		res.json({
			message: 'data fetched successfully',
			data: connectionRequests,
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequests = await connectionRequest
			.find({
				$or: [
					{ toUserId: loggedInUser._id, status: 'accepted' },
					{ fromUserId: loggedInUser._id, status: 'accepted' },
				],
			})
			.populate('fromUserId', USER_SAFEDATA)
			.populate('toUserId', USER_SAFEDATA);

		const data = connectionRequests.map((row) => {
			if (row.fromUserId._id.toString() === loggedInUser._id.toString())
				return row.toUserId;
			return row.fromUserId;
		});

		res.json({
			data,
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

userRouter.get('/feed', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const connectionRequests = connectionRequest
			.find({
				$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
			})
			.select('fromUserId toUserId');

		hideUsersFromFeed = new Set();
		(await connectionRequests).forEach((req) => {
			hideUsersFromFeed.add(req.fromUserId.toString());
			hideUsersFromFeed.add(req.toUserId.toString());
		});

		const users = await User.find({
			$and: [
				{ _id: { $nin: Array.from(hideUsersFromFeed) } },
				{ _id: { $ne: loggedInUser._id } },
			],
		})
			.select(USER_SAFEDATA)
			.skip(skip)
			.limit(limit);

		res.send(users);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});
module.exports = userRouter;
