import admin from 'firebase-admin';

export { admin, db };

admin.initializeApp();

export const GOOGLE_APPLICATION_CREDENTIALS = '/home/user/Downloads/[FILE_NAME].json';

const db = admin.firestore();
