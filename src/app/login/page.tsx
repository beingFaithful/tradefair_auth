import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { loginAction, googleSignInAction } from "@/actions/auth"
import { auth } from "../../../auth"
import { redirect } from "next/navigation"

interface LoginPageProps {
    searchParams: Promise<{ error?: string, message?: string }>
}

export default async function LoginPage ({searchParams} : LoginPageProps) {
    const session = await auth()
    if (session) redirect('/buyer')

    const params = await searchParams

    const errorMessages = {
        'invalid-credentials': 'Invalid email or password, please try again.',
        'email-exists': 'An account with this email already exists.',
    }
    
    const errorMessage = params?.error ? errorMessages[params?.error as keyof typeof errorMessages] : null
    const successMessage = params?.message === 'password-reset-success' ? 'Password reset successfully. You can now log in.' : null

    return (
        <div className="min-h-screen bg-background text-foreground bg-mesh flex items-center justify-center p-4">
            <Card className="w-full max-w-md glass rounded-[2rem] border-white/[0.04] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]">
                <div className="h-0.5 bg-gradient-to-r from-amber-500/40 via-amber-400/60 to-amber-500/40 w-full" />
                <CardHeader className="text-center pt-12 pb-2">
                    <div className="w-16 h-16 bg-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
                        <span className="text-amber-400 font-bold text-3xl tracking-tighter">T</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-white tracking-tight">
                        Welcome Back
                    </CardTitle>
                    <p className="text-slate-500 mt-2 font-light text-sm tracking-wide">Access your Tradefair account</p>
                </CardHeader>
                <CardContent className="p-8 pt-6">
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-xl text-sm font-medium flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {errorMessage}
                        </div>
                    )}    
                    {successMessage && (
                        <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/10 text-amber-400 rounded-xl text-sm font-medium flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {successMessage}
                        </div>
                    )}

                    <form action={loginAction} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">
                                Email or ID
                            </label>
                                <input
                                name="email" 
                                id="email"
                                type="email"
                                required
                                placeholder="you@mtu.edu.ng"
                                autoComplete="email"
                                className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label htmlFor="password" className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-amber-400/60 hover:text-amber-300 transition-colors"
                                >
                                    Forgot?
                                </Link>
                            </div>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                            />
                        </div>
                        
                        <Button
                            type="submit"
                            className="w-full py-4 mt-2 text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl shadow-xl shadow-amber-500/10 transition-all duration-300"
                        >
                            Sign in
                        </Button>
                    </form>

                    <div className="mt-8 flex items-center">
                        <div className="flex-grow border-t border-white/[0.04]"></div>
                        <span className="mx-4 text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em]">Social Access</span>
                        <div className="flex-grow border-t border-white/[0.04]"></div>
                    </div>

                    <form action={googleSignInAction} className="mt-8">
                        <Button
                            variant="outline"
                            type="submit"
                            className="w-full py-4 text-sm font-medium tracking-wide border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/[0.04] hover:text-white rounded-xl transition-all flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google Workspace
                        </Button>
                    </form>
                                    
                    <div className="mt-10 text-center text-sm">
                        <span className="text-slate-600 font-light">New to Tradefair? </span>
                        <Link
                            href="/signup"
                            className="font-bold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            Join Community
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
