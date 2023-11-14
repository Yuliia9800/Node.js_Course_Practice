import { Router, type Response, type Request } from 'express';
import { Genre } from '../models/genre.model';
import { genreDataValidation } from '../validations/genre.validation';
import { validationResult } from 'express-validator';

const router = Router();
/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Get a list of genres
 *     tags:
 *       - Genres
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       500:
 *         description: Internal server error
 */

router.get('/', async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find({});
    res.status(200).json(genres);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Delete a genre by ID
 *     tags:
 *       - Genres
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the genre to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const genre = await Genre.findByIdAndDelete(id);

    if (!genre) {
      return res.status(404).json({ message: `cannot find any genre with ID ${id}` });
    }
    res.status(200).json({ message: 'genre has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /genres:
 *   post:
 *     summary: Create a new genre if it doesn't already exist
 *     tags:
 *       - Genres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: Genre created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Genre already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', genreDataValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const exist = await Genre.findOne(req.body);

    if (exist) {
      return res.status(404).json({ message: 'That genre already exist' });
    }

    const genre = await Genre.create(req.body);
    res.status(200).json(genre);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /genres/{id}:
 *   put:
 *     summary: Update a genre by ID
 *     tags:
 *       - Genres
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the genre to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const genre = await Genre.findByIdAndUpdate(id, req.body);

    if (!genre) {
      return res.status(404).json({ message: `cannot find any genre with ID ${id}` });
    }
    const updatedGenre = await Genre.findById(id);
    res.status(200).json(updatedGenre);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
