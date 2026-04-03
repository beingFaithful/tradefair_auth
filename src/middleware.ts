import { verifyJWT } from "auth";
import { NextRequest, NextResponse } from "next/server";




const PUBLIC_ROUTES = ['/login', '/signup'] as const
const AUTH_ROUTES = ['/dashboard'] as const

export const middleware = (request: NextRequest) => {
    const token = request.cookies.get('token')?.value
    const IsPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname as typeof PUBLIC_ROUTES[number])
    const isAuthRoute = AUTH_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))

    if(token && IsPublicRoute){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(isAuthRoute){
        if(!token){
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            verifyJWT()
        } catch (error){
            const response = NextResponse.redirect(new URL('login' , request.url))
            response.cookies.delete('token')
            return response
        }
    }
    return NextResponse.next()
}