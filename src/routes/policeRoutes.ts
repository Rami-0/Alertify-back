import express, { Request, Response } from 'express';
import { getAllPolice, findNearestPolice } from '../controllers/policeController';

const router = express.Router();

router.get('/all', async (req: Request, res: Response) => {
	try {
		await getAllPolice(req, res);
	} catch (error) {
		res.status(500).json({ message: 'Internal server error.' });
	}
});

router.post('/nearest', async (req: Request, res: Response) => {
  try {
		await findNearestPolice(req, res);
	} catch (error) {
		res.status(500).json({ message: 'Internal server error.' });
	}
});

export default router;
