import { initializeAdmin } from './firebase/admin';
import { NextResponse } from 'next/server';

const admin = initializeAdmin();

export interface AuthenticatedUser {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
    isSuperAdmin: boolean;
}

/**
 * Verifies the Firebase ID Token from the Authorization header.
 * @param request The incoming Next.js request
 * @param requireSuperAdmin If true, only returns a user if they are the superadmin
 */
export async function getAuthenticatedUser(request: Request, requireSuperAdmin = false): Promise<AuthenticatedUser | null> {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const superAdminEmail = 'dagrabastudio@gmail.com';
        const isSuper = decodedToken.email === superAdminEmail;

        if (requireSuperAdmin && !isSuper) {
            return null;
        }

        return {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
            isSuperAdmin: isSuper,
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

/**
 * Standard error response for unauthorized requests.
 */
export function unauthorizedResponse(message = 'Unauthorized') {
    return NextResponse.json({ success: false, error: message }, { status: 401 });
}
