import express, { Request, Response } from 'express';
import {
    registerUser,
    signInUser,
    registerUserByGoogleLogin,
    updatePhoneNumber,
    getPhoneNumber,
    checkHasPassword,
    updatePassword,
} from '../controllers/auth.controller';

const authRoutes = express.Router();

authRoutes.post('/register', (req: Request, res: Response) => {
    registerUser(req, res);
});

authRoutes.post('/signin', (req: Request, res: Response) => {
    signInUser(req, res);
});

authRoutes.post('/google-login', (req: Request, res: Response) => {
    registerUserByGoogleLogin(req, res);
});

authRoutes.post('/update-phone-number', (req: Request, res: Response) => {
    updatePhoneNumber(req, res);
});

authRoutes.post('/get-phone-number', (req: Request, res: Response) => {
    getPhoneNumber(req, res);
});

authRoutes.post('/check-has-password', (req: Request, res: Response) => {
    checkHasPassword(req, res);
});

authRoutes.post('/update-password', (req: Request, res: Response) => {
    updatePassword(req, res);
});

export default authRoutes;
