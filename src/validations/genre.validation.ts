import { body } from 'express-validator';

export const genreDataValidation = body('name').exists().withMessage('User name is required');
