import { Router, type Response, type Request } from 'express';

const router = Router();

/**
 * @swagger
 * /health-check:
 *   get:
 *     summary: Get server status
 *     description: Returns a JSON response indicating the server is running.
 *     tags: [Server]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status message indicating the server is running.
 *                   example: Server is running
 *       404:
 *         description: Not found
 */

router.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

export default router;
