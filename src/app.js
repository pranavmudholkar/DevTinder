const express = require('express');

const app = express();

app.use('/', (err, req, res, next) => {
	if (err) {
		res.status(500).send('something went wrong');
	}
});

app.get('/admin/getUserData', (req, res, next) => {
	// try {
	throw new Error('sasdasd');
	res.send('All Data sent');
	// } catch {
	// res.status(500).send('Something went wrong, contact the support team');
	// }
});

app.use('/', (err, req, res, next) => {
	if (err) {
		res.status(500).send('something went wrong');
	}
});
app.listen(3000, () => {
	console.log('Hi From the port 3000');
});
