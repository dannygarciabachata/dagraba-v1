import * as admin from 'firebase-admin';

const firebaseAdminConfig = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dagraba-studio-official-23866",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export const initializeAdmin = () => {
    if (!admin.apps.length) {
        try {
            if (firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: firebaseAdminConfig.projectId,
                        clientEmail: firebaseAdminConfig.clientEmail,
                        privateKey: firebaseAdminConfig.privateKey,
                    }),
                });
                console.log('Firebase Admin initialized with Service Account');
            } else {
                // Fallback for development if keys aren't set yet
                // WARNING: This is only for local dev until service account is configured
                admin.initializeApp({
                    projectId: firebaseAdminConfig.projectId,
                });
                console.warn('Firebase Admin initialized without Service Account. Token verification may fail if not in a Google environment.');
            }
        } catch (error) {
            console.error('Firebase Admin initialization error', error);
        }
    }
    return admin;
};
