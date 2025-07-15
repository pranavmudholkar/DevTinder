const mongoose = require('mongoose');

const connectDB = async (res, rej) => {
	await mongoose.connect(
		'mongodb+srv://pranavmudholka:AUlroLNEbgc1h0Sv@namastenode.o6we1ux.mongodb.net/devTinder'
	);
};

module.exports = connectDB;
