const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const healthCheckRouter = require('./routes/health-check');

const options = {
	failOnErrors: true,
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Express API for JSONPlaceholder',
			version: '1.0.0',
		},
	},
	apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
const PORT = 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health-check', healthCheckRouter);

app.use((_, res) => {
	res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
	res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
