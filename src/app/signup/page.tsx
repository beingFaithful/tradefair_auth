import { redirect } from "next/navigation"
import { auth } from "../../../auth"
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { googleSignInAction } from "@/actions/auth"
import Link from "next/link"
import SignUpForm from "@/components/auth/SignUpForm"

interface SignUpPageProps {
    searchParams?: Promise<{ error?: string }>
}

export default async function SignUpPage ({searchParams} : SignUpPageProps) {
    const session = await auth()
    if (session) redirect('/buyer')

    const params = await searchParams

    const errorMessages = {
        'email-exists': 'An account with this email/ID already exists.',
        'invalid-email': 'Email must be firstnamelastname@mtu.edu.ng matching your provided name.',
        'invalid-department': 'The selected department does not belong to the chosen college. Please correct your selection.',
        'invalid-special-id': 'This Special ID is invalid or has already been claimed.',
        'weak-password': 'Password must be at least 8 characters long.',
        'password-mismatch': 'Passwords do not match.',
        'missing-fields': 'Please fill in all required fields.',
    }

    const errorMessage = params?.error
        ? errorMessages[params?.error as keyof typeof errorMessages]
        : null

    return (
        <div className="min-h-screen bg-background text-foreground bg-mesh flex items-center justify-center p-4 py-20">
            <Card className="w-full max-w-lg glass rounded-[2rem] border-white/[0.04] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]">
                <div className="h-0.5 bg-gradient-to-r from-amber-500/40 via-amber-400/60 to-amber-500/40 w-full" />
                <CardHeader className="text-center pt-12 pb-2">
                    <div className="w-16 h-16 bg-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
                        <span className="text-amber-400 font-bold text-3xl tracking-tighter">T</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-white tracking-tight">
                        Join Tradefair
                    </CardTitle>
                    <p className="text-slate-500 mt-2 font-light text-sm tracking-wide">Create your marketplace account</p>
                </CardHeader>
                <CardContent className="p-8 pt-6">
                    {errorMessage && (
                        <div className="mb-8 p-4 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-xl text-sm font-medium flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {errorMessage}
                        </div>
                    )}  

                    <SignUpForm />

                    <div className="mt-10 flex items-center">
                        <div className="flex-grow border-t border-white/[0.04]"></div>
                        <span className="mx-4 text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em]">Social Access</span>
                        <div className="flex-grow border-t border-white/[0.04]"></div>
                    </div>

                    <form action={googleSignInAction} className="mt-10">
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
                            Join with Google
                        </Button>
                    </form>
                                    
                    <div className="mt-12 text-center text-sm">
                        <span className="text-slate-600 font-light">Already have an account? </span>
                        <Link
                            href="/login"
                            className="font-bold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
