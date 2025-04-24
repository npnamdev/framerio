import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) { return NextResponse.redirect(new URL('/sign-in', req.url)); }

    try {
        const response = await fetch('http://localhost:8080/api/protected', {
            headers: { Authorization: `Bearer ${refreshToken}` },
        });

        if (response.status !== 200) {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }
}

export const config = {
    matcher: ['/manage/:path*'],
};
