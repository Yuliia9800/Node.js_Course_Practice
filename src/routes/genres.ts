import { Router, type Response, type Request } from 'express';
import { Genre } from '../models/genre.model';

const router = Router();

/**
 * @swagger
 * /genre:
 *   get:
 *     summary: Get a list of genres
 *     tags:
 *       - Genres
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - genreName: Action
 *               - genreName: Drama
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
 * /genre/{id}:
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
 * /genre:
 *   post:
 *     summary: Create a new genre
 *     tags:
 *       - Genres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genreName:
 *                 type: string
 *                 description: The name of the genre.
 *     responses:
 *       200:
 *         description: Genre created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const genre = await Genre.create(req.body);
    res.status(200).json(genre);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /genre/{id}:
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
 *             type: object
 *             properties:
 *               genreName:
 *                 type: string
 *                 description: The updated name of the genre.
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
