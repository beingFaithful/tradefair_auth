import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { resetPasswordAction } from "@/actions/password"
import Link from "next/link"

interface ResetPasswordProps {
    searchParams: Promise<{ token?: string, error?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordProps) {
    const params = await searchParams;
    const token = params?.token;
    const error = params?.error;

    const errorMessages: Record<string, string> = {
        'invalid-token': 'The reset link is invalid or has expired.',
        'missing-fields': 'Please provide a valid token and password.',
    }

    const errorMessage = error ? errorMessages[error] || 'An error occurred.' : null;

    if (!token) {
        return (
            <div className="min-h-screen bg-background text-foreground bg-mesh flex items-center justify-center p-4">
                <Card className="w-full max-w-md glass rounded-[2rem] border-white/[0.04] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] text-center">
                    <div className="h-0.5 bg-gradient-to-r from-amber-500/40 via-amber-400/60 to-amber-500/40 w-full" />
                    <CardHeader className="pt-12">
                        <div className="w-16 h-16 bg-rose-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/10">
                            <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl font-bold text-white tracking-tight">Invalid Link</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-2">
                        <p className="mb-6 text-slate-500 font-light">You must provide a valid reset token in the URL.</p>
                        <Link href="/forgot-password" className="font-bold text-amber-400 hover:text-amber-300 transition-colors">
                            Request a new link
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground bg-mesh flex items-center justify-center p-4">
            <Card className="w-full max-w-md glass rounded-[2rem] border-white/[0.04] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]">
                <div className="h-0.5 bg-gradient-to-r from-amber-500/40 via-amber-400/60 to-amber-500/40 w-full" />
                <CardHeader className="text-center pt-12 pb-2">
                    <div className="w-16 h-16 bg-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
                        <span className="text-amber-400 font-bold text-3xl tracking-tighter">T</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-white tracking-tight">
                        Set New Password
                    </CardTitle>
                    <p className="text-slate-500 mt-2 font-light text-sm tracking-wide">Enter your new secure password below.</p>
                </CardHeader>
                <CardContent className="p-8 pt-6">
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-xl text-sm font-medium flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {errorMessage}
                        </div>
                    )}

                    <form action={resetPasswordAction} className="space-y-5">
                        <input type="hidden" name="token" value={token} />

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">
                                New Password
                            </label>
                            <input
                                name="password"
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-4 mt-2 text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl shadow-xl shadow-amber-500/10 transition-all duration-300"
                        >
                            Reset Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
