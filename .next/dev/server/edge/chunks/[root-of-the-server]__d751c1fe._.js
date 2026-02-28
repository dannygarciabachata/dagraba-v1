(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__d751c1fe._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/development/Da Graba_Studio/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next-intl/dist/esm/development/middleware/middleware.js [middleware-edge] (ecmascript)");
;
const intlMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])({
    locales: [
        'en',
        'es',
        'pt',
        'fr',
        'de',
        'it',
        'ja'
    ],
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});
function middleware(request) {
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
const config = {
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_static (static files)
    // - /favicon.ico, /noise.png, etc. (static files)
    matcher: [
        '/((?!api|_next|_static|.*\\..*).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__d751c1fe._.js.map