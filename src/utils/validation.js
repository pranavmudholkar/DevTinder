const validator = require('validator');

const validateSignUpData = (req) => {
	const { firstName, lastName, emailId, password } = req.body;
	if (!firstName || !lastName)
		throw new Error('Name is invalid! Enter a valid name');
	else if (!validator.isEmail(emailId))
		throw new Error('Email ID is not valid! Enter a valid email ID');
	else if (!validator.isStrongPassword(password))
		throw new Error(
			"Entered Password isn't strong enough. Please enter a strong password according to the standards"
		);
};

module.exports = { validateSignUpData };
