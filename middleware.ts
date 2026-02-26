import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect all /admin routes
    if (pathname.startsWith('/admin')) {
        // Simple mock authentication check.
        // In a real app, this would verify a JWT, session token, or cookie.
        // Here we check for a specific cookie 'admin_access' with value 'danny_admin_token'
        const adminToken = request.cookies.get('admin_access')?.value;

        if (adminToken !== 'danny_admin_token') {
            // Redirect unauthorized users back to the dashboard or login
            // Temporarily disabled for testing
            // return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

// Configure the middleware to only run on the admin route
export const config = {
    matcher: ['/admin/:path*'],
};
