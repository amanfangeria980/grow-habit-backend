import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from './routes/admin.route';
import whatsappRoutes from './routes/whatsapp.route';
import { adminTwoPointerStatusAlertMorning } from '../cron-jobs/whatsapp-admin-alerts';
import { reflectionFormAlert } from '../cron-jobs/reflection-form-alerts';
import userRouter from './routes/user.route';
import authRoutes from './routes/auth.route';
import logger from '../utils/logger';
import morgan from 'morgan';
import { goodNightMessage } from '../cron-jobs/good-night-message';

adminTwoPointerStatusAlertMorning.start();
reflectionFormAlert.start();
goodNightMessage.start();

console.log('Cron job for Two Pointer Status Alert Morning has been started.');

dotenv.config();

const morganFormat = ':method :url :status :response-time ms';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(
    morgan(morganFormat, {
        stream: {
            write: (message: string) => {
                const logObject = {
                    method: message.split(' ')[0],
                    url: message.split(' ')[1],
                    status: message.split(' ')[2],
                    responseTime: message.split(' ')[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);

// Root Route
app.get('/', (req: Request, res: Response) => {
    console.log('Log: Serve is hit');

    res.send('Welcome to the Grow Habit Backend!!!');
});

// Admin Routes
app.use('/admin', adminRoutes);

// Whatsapp Routes
app.use('/whatsapp', whatsappRoutes);

// User Routes
app.use('/user', userRouter);

// Auth Routes
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
