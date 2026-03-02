import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
    locales: ['en', 'es', 'pt', 'fr', 'de', 'it', 'ja'],
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect all /admin routes
    if (pathname.includes('/admin')) {
        const adminToken = request.cookies.get('admin_access')?.value;
        if (adminToken !== 'danny_admin_token') {
            // return NextResponse.redirect(new URL('/dashboard', request.url));
        }
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
