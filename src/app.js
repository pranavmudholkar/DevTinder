const express = require('express');

const app = express();

app.use('/', (req, res) => {
	res.send('Hi hi');
});

app.use('/hello', (req, res) => {
	res.send('Hello hello ');
});

app.use('/test', (req, res) => {
	res.send('Hi from the server');
});

app.listen(3000, () => {
	console.log('Hi From the port 3000');
});
