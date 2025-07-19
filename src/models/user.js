const mongoose = require('mongoose');

const validator = require('validator');
const userrSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			minLength: 4,
			maxLength: 50,
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
			validate(value) {
				if (!['male', 'female', 'others'].includes(value)) {
					throw new Error('Gender data is not valid');
				}
			},
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

module.exports = mongoose.model('User', userrSchema);
