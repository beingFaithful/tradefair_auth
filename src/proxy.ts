import { auth } from "../auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password']
const PROTECTED_ROUTES = ['/buyer', '/seller', '/admin', '/dashboard']

export const proxy = auth((req) => {
    const { nextUrl } = req
    const isAuthenticated = !!req.auth

    const isPublicRoute = PUBLIC_ROUTES.some(route => nextUrl.pathname.startsWith(route))
    const isProtectedRoute = PROTECTED_ROUTES.some(route => nextUrl.pathname.startsWith(route))

    // Redirect authenticated users away from login/signup
    if (isAuthenticated && isPublicRoute) {
        return NextResponse.redirect(new URL('/buyer', req.url))
    }

    // Redirect unauthenticated users away from protected routes
    if (!isAuthenticated && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}