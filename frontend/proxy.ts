import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
    locales: ['en', 'es', 'pt', 'fr', 'de', 'it', 'ja'],
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect all /admin routes
    if (pathname.includes('/admin')) {
        // In a real app, we'd check a secure httpOnly cookie or JWT role here.
        // For now, we rely on client-side protection and API route checks.
        // This is a placeholder for server-side redirection if we had session data in cookies.
    }

    return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_static (static files)
    // - /favicon.ico, /noise.png, etc. (static files)
    matcher: ['/((?!api|_next|_static|.*\\..*).*)']
};
