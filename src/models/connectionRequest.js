const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', //reference to user collection
			required: true,
		},
		toUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
		status: {
			type: String,
			ref: 'User', //reference to user collection
			required: true,
			enum: {
				values: ['ignored', 'interested', 'accepted', 'rejected'],
				message: '{VALUE} in an incorrect status type',
			},
		},
	},
	{
		timestamps: true,
	}
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', function (next) {
	const connectionRequest = this;
	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId))
		throw new Error('You cannot send a request to yourself');
	next();
});

const ConnectionRequestModel = mongoose.model(
	'connectionRequest',
	connectionRequestSchema
);

module.exports = ConnectionRequestModel;
