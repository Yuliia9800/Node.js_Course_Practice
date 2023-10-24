import express, { type Request, type RequestHandler, type Response, type NextFunction } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';

import healthCheckRouter from './routes/health-check';
import moviesRouter from './routes/movies';
import genresRouter from './routes/genres';

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API for JSONPlaceholder',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
const PORT = 3000;

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

mongoose
  .connect('mongodb+srv://uliasumik:3GyGBvHtpl4AyYjR@yuliia.pniib08.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Mongoose connected!');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
