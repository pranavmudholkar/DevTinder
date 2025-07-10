const express = require('express');

const app = express();

const { adminAuth, userAuth } = require('./middleware/auth');

app.use('/admin', adminAuth);

app.use('/user', userAuth);

app.get('/user/login', (req, res, next) => {
	res.send('User login sent!!');
});

app.get('/user/data', (req, res, next) => {
	res.send('User data sent!!');
});

app.get('/admin/getAllData', (req, res, next) => {
	res.send('All Data sent');
});

app.get('/admin/deleteUser', (req, res, next) => {
	res.send('User Deleted successfully');
});

app.listen(3000, () => {
	console.log('Hi From the port 3000');
});
