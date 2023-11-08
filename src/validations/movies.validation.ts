import { body } from 'express-validator';

export const moviesDataValidation = [
  body('title').exists().withMessage('Title is required'),
  body('description').exists().withMessage('Description is required'),
  body('releaseDate').exists().withMessage('Release date is required').isDate().withMessage('Should be valid date'),
  body('genre').exists().withMessage('Genre name is required').isArray().withMessage('Should be array'),
];
