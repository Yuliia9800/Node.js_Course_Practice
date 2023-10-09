const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health-check', (req, res) => {
	res.json({ status: 'Server is running' });
});

app.use('/not-found', (req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

app.use('/internal-error', (req, res) => {
	throw new Error('Simulated Internal Server Error');
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Internal Server Error' });
});

// Start server on port 3000
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
