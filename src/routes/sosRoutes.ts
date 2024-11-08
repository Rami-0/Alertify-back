import express, { Request, Response } from 'express';
import { createSos } from '../controllers/sosController';

const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
	try {
		await createSos(req, res);
	} catch (error) {
		res.status(400).json({ message: error });
	}
});

export default router;
