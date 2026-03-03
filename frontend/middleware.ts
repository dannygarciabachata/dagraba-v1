import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'es', 'pt', 'fr', 'de', 'it', 'ja'],

    // Used when no locale matches
    defaultLocale: 'en'
});

export const config = {
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_static (inside /public)
    // - /exports, /covers, /datasets (static AI assets)
    // - all root files inside /public (e.g. /favicon.ico)
    matcher: ['/((?!api|_next|_static|_vercel|exports|covers|datasets|[\\w-]+\\.\\w+).*)']
};
