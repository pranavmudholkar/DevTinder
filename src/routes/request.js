const express = require('express');
const requestsRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const cookieParser = require('cookie-parser');
const ConnectionRequestModel = require('../models/connectionRequest');

const User = require('../models/user');

requestsRouter.post(
	'/request/send/:status/:toUserId',
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;
			const status = req.params.status;

			const allowedStatus = ['interested', 'ignored'];
			if (!allowedStatus.includes(status))
				return res.status(400).json({
					message: 'Invalid status type: ' + status,
				});

			const isToUserIdValid = await User.findById(toUserId);
			if (!isToUserIdValid) {
				return res.status(400).json({
					message: 'User not found',
				});
			}
			const existingConnectionRequest = await ConnectionRequestModel.findOne({
				$or: [
					{ fromUserId, toUserId },
					{ fromUserId: toUserId, toUserId: fromUserId },
				],
			});

			if (existingConnectionRequest)
				return res.status(400).json({
					message: 'Connection request already exists!!',
				});

			const connectionRequest = new ConnectionRequestModel({
				fromUserId,
				toUserId,
				status,
			});

			const data = await connectionRequest.save();
			res.json({
				message: 'Connection request sent successfully!',
				data,
			});
		} catch (err) {
			res.status(400).send('ERROR: ' + err.message);
		}
	}
);

module.exports = requestsRouter;
