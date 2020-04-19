import { Request, Response } from 'express';
import firebase from 'firebase';
import { config } from '../util/config';
import { validateLoginData } from '../util/validators';

firebase.initializeApp(config);

// Login
export const loginUser = (request: Request, response: Response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => (data.user ? data.user.getIdToken() : null))
    .then(token => response.json({ token }))
    .catch(error => {
      console.error(error);
      return response.status(403).json({ general: 'wrong credentials, please try again' });
    });
};
