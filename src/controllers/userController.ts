import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { comparePassword, hashPassword } from '../utils/bcrypt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<Response | any> => {
	const { phoneNumber, password, email, name } = req.body;
	try {
		const userExists = await prisma.users.findUnique({ where: { phoneNumber } });

		if (userExists) {
			throw new Error('User already exists.');
		}

		const hashedPassword = await hashPassword(password);

		const newUser = await prisma.users.create({
			data: { phoneNumber, password: hashedPassword, email, name },
		});

		if (!newUser) {
			throw new Error('Creating user failed.');
		}

		const token = generateToken(String(newUser.id));

		res.cookie('token', token, {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		return res.status(201).json({ message: 'User created!', id: newUser.id });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: `${error}` });
	}
};

export const login = async (req: Request, res: Response): Promise<Response | any> => {
	const { phoneNumber, password } = req.body;

	try {
		const user = await prisma.users.findUnique({ where: { phoneNumber } });

		if (!user) {
			throw new Error('Something went wrong. Please try again!');
		}

		const isPassword = await comparePassword(password, user.password);

		if (!isPassword) {
			throw new Error('Login failed. Please try again!');
		}

		const token = generateToken(String(user.id));

		res.cookie('token', token, {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		return res.status(200).json({ message: 'Login Successful!', id: user.id });
	} catch (error) {
		console.log(error);
		return res.status(403).json({ message: `${error}` });
	}
};

export const logout = async (req: Request, res: Response): Promise<Response | any> => {
	res.clearCookie('token');
	return res.status(200).json({ message: 'User logged out!' });
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
	const user = req.user;

	try {
		const currentUser = await prisma.users.findUnique({
			where: { id: Number(user.userId) },
		});

		res.status(200).json({
			id: currentUser?.id,
			phoneNumber: currentUser?.phoneNumber,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: `${error}` });
	}
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await prisma.users.findUnique({
			where: { id: Number(req.params.userId) },
			include: { position: true },
		});

		if (!user) {
			const error = new Error('User not found!');
			throw error;
		}

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

interface UpdateUserPositionParams {
	userId: string;
}

interface UpdateUserPositionBody {
	lat: number;
	lng: number;
}

export const updateUserPosition = async (req: Request<UpdateUserPositionParams, {}, UpdateUserPositionBody>, res: Response, next: NextFunction): Promise<Response | void> => {
	const userId = parseInt(req.params.userId, 10); // Convert userId to a number
	const { lat, lng } = req.body;

	if (isNaN(userId)) {
		return res.status(400).json({ message: 'Invalid user ID format' });
	}

	if (typeof lat !== 'number' || typeof lng !== 'number') {
		return res.status(400).json({ message: 'Latitude and longitude must be numbers' });
	}

	try {
		// Check if the user exists
		const user = await prisma.users.findUnique({ where: { id: userId } });
		if (!user) {
			return res.status(404).json({ message: 'User not found!' });
		}

		// Update or create the position for the user
		const updatedUser = await prisma.users.update({
			where: { id: userId },
			data: {
				position: {
					upsert: {
						create: { latitude: lat, longitude: lng },
						update: { latitude: lat, longitude: lng },
					},
				},
			},
			include: { position: true },
		});

		return res.status(200).json({ message: 'User position updated!', user: updatedUser });
	} catch (error) {
		next(error);
	}
};

export const updateUserConformation = async (req: Request<UpdateUserPositionParams, {}, UpdateUserPositionBody>, res: Response, next: NextFunction): Promise<Response | void> => {
	const userId = parseInt(req.params.userId, 10);

	if (isNaN(userId)) {
		return res.status(400).json({ message: 'Invalid user ID format' });
	}

	try {
		// Check if the user exists
		// const user = await prisma.users.findUnique({ where: { id: userId } });
		// if (!user) {
		// 	return res.status(404).json({ message: 'User not found!' });
		// }

		// Update or create the position for the user
		const updatedUser = await prisma.users.update({
			where: { id: userId },
			data: {
        isConfirmed: true,
      },
		});

		return res.status(200).json({ message: 'User isConfirmed!', user: updatedUser });
	} catch (error) {
		next(error);
	}
};
