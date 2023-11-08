import { Router, type Response, type Request } from 'express';
import { Movie } from '../models/movie.model';
import { moviesDataValidation } from '../validations/movies.validation';
import { validationResult } from 'express-validator';

const router = Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get a list of movies
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal server error
 */

router.get('/', async (_req: Request, res: Response) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie if it doesn't exist
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie already exists
 *       500:
 *         description: Internal server error
 */

router.post('/', moviesDataValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const exist = await Movie.findOne(req.body);

    if (exist) {
      return res.status(404).json({ message: 'That movie already exist' });
    }

    const movie = await Movie.create(req.body);

    res.status(200).json(movie);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(id, req.body);

    if (!movie) {
      return res.status(404).json({ message: `cannot find any movie with ID ${id}` });
    }
    const updatedMovie = await Movie.findById(id);
    res.status(200).json(updatedMovie);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({ message: `cannot find any movie with ID ${id}` });
    }
    res.status(200).json({ message: 'movie has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /movies/genre/{genreName}:
 *   get:
 *     summary: Get movies by genre
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: genreName
 *         required: true
 *         description: Name of the genre to filter movies
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal server error
 */

router.get('/genre/:genreName', async (req: Request, res: Response) => {
  try {
    const { genreName } = req.params;
    const movies = await Movie.find({ genre: genreName });

    res.status(200).json(movies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
