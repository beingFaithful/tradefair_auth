import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { forgotPasswordAction } from "@/actions/password"

interface ForgotPasswordProps {
    searchParams: Promise<{ success?: string }>
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordProps) {
    const params = await searchParams;
    const isSuccess = params?.success === 'true';

    return (
        <div className="min-h-screen bg-background text-foreground bg-mesh flex items-center justify-center p-4">
            <Card className="w-full max-w-md glass rounded-[2rem] border-white/[0.04] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]">
                <div className="h-0.5 bg-gradient-to-r from-amber-500/40 via-amber-400/60 to-amber-500/40 w-full" />
                <CardHeader className="text-center pt-12 pb-2">
                    <div className="w-16 h-16 bg-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
                        <span className="text-amber-400 font-bold text-3xl tracking-tighter">T</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-white tracking-tight">
                        Forgot Password
                    </CardTitle>
                    <p className="text-slate-500 mt-2 font-light text-sm tracking-wide">Enter your email to receive a reset link</p>
                </CardHeader>
                <CardContent className="p-8 pt-6">
                    {isSuccess ? (
                        <div className="mb-4 p-4 bg-amber-500/5 border border-amber-500/10 text-amber-400 rounded-xl text-sm font-medium flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            If an account exists with that email, we have sent a password reset link. Please check your inbox.
                        </div>
                    ) : (
                        <form action={forgotPasswordAction} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">
                                    Email Address
                                </label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="you@mtu.edu.ng"
                                    className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-4 mt-2 text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl shadow-xl shadow-amber-500/10 transition-all duration-300"
                            >
                                Send Reset Link
                            </Button>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm">
                        <Link
                            href="/login"
                            className="font-bold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            &larr; Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
