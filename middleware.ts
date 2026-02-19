import { NextResponse, type NextRequest } from 'next/server';
import { decrypt } from './lib/auth';
import { cookies } from 'next/headers';

// Helper function to update session if needed (rolling expiration) -> for now simple check
// We will just verify here.

export async function middleware(request: NextRequest) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/memories', '/moods', '/messages', '/vault'];
    const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    // If attempting to access protected route without session
    if (isProtected) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Verify session validity
        const payload = await decrypt(session);
        if (!payload) {
            // Invalid session
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // If manually visiting /login or /register while authenticated, redirect to dashboard
    if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
        const payload = await decrypt(session);
        if (payload) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
