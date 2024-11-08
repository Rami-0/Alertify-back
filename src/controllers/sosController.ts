import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createSos = async (req: Request, res: Response): Promise<Response | void> => {
	const { uid, contacts, email } = req.body;
	console.log(req.body);

	try {
		const user = await prisma.users.findUnique({ where: { id: parseInt(uid) }, include: { position: true } });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const existingSos = await prisma.sOS.findFirst({ where: { email: email || user.email } });

		if (existingSos) {
			const updatedSos = await prisma.sOS.update({
				where: { id: existingSos.id },
				data: {
					lat: user.position?.latitude,
					lng: user.position?.longitude,
					contacts: user.phoneNumber,
					email: email || user.email,
					isConfirmed: true,
				},
			});
			return res.status(200).json({ message: 'SOS updated successfully!', sos: updatedSos, position: user.position });
		}

		const newSos = await prisma.sOS.create({
      data: {
        // @ts-ignore
				lat: user?.position?.latitude,
        // @ts-ignore
				lng: user?.position?.longitude,
				contacts: user.phoneNumber,
				email: email || user.email,
				isConfirmed: true,
			},
		});

		res.status(201).json({ message: 'SOS created successfully!', sos: newSos, position: user.position });
	} catch (error) {
		console.error('Error creating SOS:', error);
		res.status(500).json({ message: 'Error creating SOS.' });
	}
};
