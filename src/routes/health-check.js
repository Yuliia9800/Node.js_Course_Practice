const express = require('express');
const router = express.Router();

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

router.get('/', function (_, res) {
	res.json({ status: 'Server is running' });
});

module.exports = router;
