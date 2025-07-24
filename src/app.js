const express = require('express');
const User = require('./models/user');
const connectDB = require('./config/database');
const app = express();
const validator = require('validator');

const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestsRouter = require('./routes/request');

//The requests will come to this point and then move inside the routers and check if the intenteded route is present inside that particular Handler.
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestsRouter);

//ConnectDB returns a promise
connectDB()
	//We calling connect DB first becaause we should always connect to the DB before we start listening to the incoming requests on the server.
	.then(() => {
		console.log('Database connection established');

		app.listen(7777, () => {
			console.log('Hi From the port 7777');
		});
	})
	.catch((err) => {
		console.log('Database connection could not be established');
	});
