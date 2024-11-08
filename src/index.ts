import express, { Application, urlencoded } from 'express';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
import errorMiddleware from './middlewares/errorHandler';
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import policeRoutes from './routes/policeRoutes'; // Add this line
import sosRoutes from './routes/sosRoutes'; // Add this line
configDotenv();

const app: Application = express();
const PORT = process.env.PORT;

// console.log(process.env.FRONTEND_URL);

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: '*', // process.env.FRONTEND_URL
		credentials: false,
	}),
);

app.get('/', (req, res) => {
	res.send('Hello Server');
});

app.use('/users', userRoutes);
app.use('/police', policeRoutes);
app.use('/sos', sosRoutes);

// Middleware
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
