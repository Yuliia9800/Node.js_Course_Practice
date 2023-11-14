import express, { type Request, type RequestHandler, type Response, type NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';
import 'dotenv/config';

import healthCheckRouter from './routes/health-check';
import moviesRouter from './routes/movies';
import genresRouter from './routes/genres';
import mongoose from 'mongoose';

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API for JSONPlaceholder',
      version: '1.0.0',
    },
  },
  apis: ['./src/swagger-definitions.yaml', './src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(`${process.env.MONGO_DB}`)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health-check', healthCheckRouter);

app.use('/movies', moviesRouter);
app.use('/genres', genresRouter);

app.use<RequestHandler>((_, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

export { app };
