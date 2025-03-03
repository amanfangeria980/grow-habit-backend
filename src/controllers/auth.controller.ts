import { Request, Response } from 'express';
import db from '../../utils/firebase';
import { nanoid } from 'nanoid';
import sendEmail from '../../utils/email';

export const registerUser = async (req: Request, res: Response) => {
    const { fullName, email, password, phoneNumber, countryCode, mnk } = req.body;
    console.log("The value of mnk is", mnk)
    const id = nanoid();

    try {
        // Check if user already exists
        const existingUser = await db.collection('users').where('email', '==', email).get();

        if (!existingUser.empty) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        // Create new user document
        const userDoc = {
            id,
            fullName,
            email,
            phoneNumber,
            countryCode,
            profileImage: '',
            // hash the password
            password,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            role: 'user',
            mnk : null, 
            primaryHabit : null, 
            secondaryHabit : [], 
        };
        sendEmail({
            to: email,
            subject: 'Welcome to Grow Habit!',
            text: 'Welcome to Grow Habit!',
        });
        const result = await db.collection('users').doc(id).set(userDoc);
        console.log('User registered successfully', result);
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id,
                fullName,
                email,
                phoneNumber,
                countryCode,
                role: 'user',
            },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while registering user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const registerUserByGoogleLogin = async (req: Request, res: Response) => {
    const { fullName, email, oauthId, image } = req.body;

    try {
        // Check if user already exists
        const existingUser = await db.collection('users').where('email', '==', email).get();
        if (!existingUser.empty) {
            const userData = existingUser.docs[0].data();
            await db.collection('users').doc(userData.id).update({
                // profileImage: image || userData.profileImage,
                oauthId: oauthId,
                updatedAt: new Date().toISOString(),
            });

            return res.status(200).json({
                success: true,
                message: 'User updated with Google provider',
                user: {
                    id: userData.id,
                    fullName: userData.fullName,
                    email: userData.email,
                    role: userData.role,
                },
            });
        }

        // Create new user document if user doesn't exist
        const id = nanoid();
        const userDoc = {
            id,
            oauthId,
            fullName,
            email,
            profileImage: image,
            countryCode: null,
            phoneNumber: null,
            password: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            role: 'user',
            provider: 'google',
            mnk : null , 
            primaryHabit : null, 
            secondaryHabit : [], 
            archivedHabits : []
        };

        const result = await db.collection('users').doc(id).set(userDoc);
        console.log('result', result);
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id,
                fullName,
                email,
                role: 'user',
            },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while registering user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const signInUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const userSnapshot = await db.collection('users').where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(401).json({
                success: false,
                // message: "Invalid email or password",
                message: 'Invalid email',
            });
        }

        const userData = userSnapshot.docs[0].data();

        // In production, you should use proper password hashing comparison
        if (userData.password !== password) {
            return res.status(401).json({
                success: false,
                // message: "Invalid email or password",
                message: 'Invalid password',
            });
        }

        // Return user data without sensitive information
        return res.status(200).json({
            success: true,
            message: 'Sign in successful',
            user: {
                id: userData.id,
                email: userData.email,
                fullName: userData.fullName,
                role: userData.role,
            },
        });
    } catch (error) {
        console.error('Error in sign in:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during sign in',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const updatePhoneNumber = async (req: Request, res: Response) => {
    const { email, phoneNumber, countryCode } = req.body;
    console.log('req.body', req.body);
    const user = await db.collection('users').where('email', '==', email).get();
    if (user.empty) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userData = user.docs[0].data();
    await db.collection('users').doc(userData.id).update({
        phoneNumber,
        countryCode,
        updatedAt: new Date().toISOString(),
    });
    return res.status(200).json({ success: true, message: 'Phone number updated successfully' });
};

export const getPhoneNumber = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await db.collection('users').where('email', '==', email).get();
    if (user.empty) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userData = user.docs[0].data();
    // if phone number is null, it is also being returned
    return res.status(200).json({
        success: true,
        message: 'Phone number fetched successfully',
        phoneNumber: userData.phoneNumber,
        countryCode: userData.countryCode,
    });
};

export const checkHasPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await db.collection('users').where('email', '==', email).get();
    if (user.empty) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userData = user.docs[0].data();
    return res.status(200).json({
        success: true,
        message: 'Password fetched successfully',
        hasPassword: userData.password !== null,
    });
};

export const updatePassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await db.collection('users').where('email', '==', email).get();
    if (user.empty) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userData = user.docs[0].data();
    await db.collection('users').doc(userData.id).update({
        password,
        updatedAt: new Date().toISOString(),
    });
    return res.status(200).json({ success: true, message: 'Password updated successfully' });
};
