import { Request, Response } from 'express';
import { admin, db } from './admin';

export interface UserRequest extends Request {
  user: {
    country?: string;
    createdAt?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    uid?: string;
    username?: string;
  };
}

export const auth = async (request: UserRequest, response: Response, next) => {
  const isValidToken = request.headers.authorization && request.headers.authorization.startsWith('Bearer ');

  if (!isValidToken) {
    console.error('No token found');
    return response.status(403).json({ error: 'Unauthorized' });
  }

  const idToken = request.headers.authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const dbUser = await db
      .collection('users')
      .where('userId', '==', request.user.uid)
      .limit(1)
      .get();

    request.user = decodedToken;

    request.user.username = dbUser.docs[0].data().username;

    return next();
  } catch (err) {
    console.error('Error while verifying token', err);
    return response.status(403).json(err);
  }
};
