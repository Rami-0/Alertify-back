import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { calculateDistance } from '../utils/calculateDistance';

const prisma = new PrismaClient();

export const getAllPolice = async (req: Request, res: Response) => {
	try {
		const policeOfficers = await prisma.police.findMany({
			include: { position: true },
		});
		res.status(200).json(policeOfficers);
	} catch (error) {
		console.error('Error fetching police data:', error);
		res.status(500).json({ message: 'Error fetching police data.' });
	}
};

export const findNearestPolice = async (req: Request, res: Response): Promise<Response | void> => {
	const { sosId, lat, lng, count = 1 } = req.body; // 'count' is the number of nearest police officers to return

	if (!lat || !lng) {
		return res.status(400).json({ message: 'Latitude and longitude are required.' });
	}

	const myLocation = {
		lat: parseFloat(lat as string),
		lng: parseFloat(lng as string),
	};

	try {
		// Fetch police officers with their position data
		const policeOfficers = await prisma.police.findMany({
			include: { position: true },
		});


		// Calculate distance and filter the nearest police officers
		const nearestPolice = policeOfficers
			.map((officer) => {
				const distance = calculateDistance(myLocation.lat, myLocation.lng, officer.position.latitude, officer.position.longitude);
				return { ...officer, distance }; // Add distance to officer object
			})
			.sort((a, b) => a.distance - b.distance) // Sort by distance
			.slice(0, Number(count)); // Get the nearest 'count' officers

		// Update SOS id with Closest PoliceMan object
		const sos = await prisma.sOS.update({
			where: { id: Number(sosId) },
			data: {
				policeId: nearestPolice[0].id,
			},
		});
		return res.status(200).json({
      nearestPolice,
      sos
    });
	} catch (error) {
		console.error('Error finding nearest police:', error);
		return res.status(500).json({ message: 'Error finding nearest police.' });
	}
};
