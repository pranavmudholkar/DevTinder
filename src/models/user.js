const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			minLength: 4,
			maxLength: 50,
			index: true,
		},
		lastName: {
			type: String,
		},
		emailId: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid Email Address: ' + value);
				}
			},
		},
		password: {
			type: String,
			required: true,
			unique: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error('Password not strong enough');
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			enum: {
				values: ['male', 'female', 'others'],
				message: '{value} is not a valid gender type',
			},
			// validate(value) {
			// 	if (!['male', 'female', 'others'].includes(value)) {
			// 		throw new Error('Gender data is not valid');
			// 	}
			// },
		},
		photoURL: {
			type: String,
			default:
				'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.webp',
			validate(value) {
				if (!validator.isURL(value)) {
					throw new Error('URL Invalid ' + value);
				}
			},
		},
		about: {
			type: String,
			default: 'Test default dataa',
		},
		skills: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id }, 'DEV@Tinder@790', {
		expiresIn: '7d',
	});

	return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
	const user = this;
	const passwordHash = user.password;
	const isPassowrdValid = await bcrypt.compare(
		passwordInputByUser,
		passwordHash
	);
	return isPassowrdValid;
};

module.exports = mongoose.model('User', userSchema);
