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
				message: `${req.user.firstName} ${
					status == 'interested'
						? `has sent a Connection request to ${isToUserIdValid.firstName}`
						: `has ignored the Connection request of ${isToUserIdValid.firstName}`
				} `,
				data,
			});
		} catch (err) {
			res.status(400).json({ message: err.message });
		}
	}
);

requestsRouter.post(
	'/request/review/:status/:requestId',
	userAuth,
	async (req, res) => {
		try {
			loggedInUser = req.user;
			const status = req.params.status;
			const requestId = req.params.requestId;
			//validate the status
			allowedStatus = ['accepted', 'rejected'];
			isStatusAllowed = allowedStatus.includes(status);
			if (!isStatusAllowed) {
				throw new Error('Invalid status! Please try again');
			}

			//validate requestId
			const connectionRequest = await ConnectionRequestModel.findById({
				_id: requestId,
				toUserId: loggedInUser._id,
				status: 'interested',
			});

			if (!connectionRequest)
				throw new Error('Invalid Request! Please try again');

			if (['accepted', 'rejected'].includes(connectionRequest.status)) {
				throw new Error('This request has already been reviewed.');
			}

			if (!connectionRequest.status === 'interested')
				throw new Error('Invalid request!! Please try again.');

			//Validate if the logged in user is the toUserId
			if (!connectionRequest.toUserId.equals(loggedInUser._id))
				throw new Error('Invalid User! Please login again');

			connectionRequest['status'] = status;
			const data = await connectionRequest.save();
			res.status(200).json({
				message: `${loggedInUser.firstName} has ${status} the connection request`,
				data: data,
			});
		} catch (err) {
			res.status(400).json({ message: err.message });
		}
	}
);

module.exports = requestsRouter;
