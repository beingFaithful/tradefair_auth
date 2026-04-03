import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { loginAction } from "@/actions/auth"

interface LoginPageProps {
    searchParams: Promise<{ error?: string }>
}


export default async function LoginPage ({searchParams} : LoginPageProps) {
         
    const params = await searchParams

    const errorMessages = {
        'invalid-credentials': 'Invalid email or password, please try again.',
        'email-exists': 'An account with this email already exists.',
    }
    
const errorMessage = params?.error ? errorMessages[params?.error as keyof typeof errorMessages] : null

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <Card className="w-full max-w-md shadow-x1 rounded-2x1 border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className= "text-center">
            <CardTitle className= "text-3x1 font-bold text-gray-800">
                Welcome Back
            </CardTitle>
            <p className= "text-gray-500 mt-2">Sign in to your account</p>
        </CardHeader>
        <CardContent>
            {errorMessage && (
                <div className= "mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {errorMessage}
                </div>
            )}    

            <form action={loginAction} className="space-y-6">
                <div className="space-y-2">
                        <label htmlFor="email" className="text-gray-700">
                            Email Address
                        </label>
                        <input
                            name="email" 
                            id="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="py-5 px-4 text-base rounded-x1"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                        <label htmlFor="password" className="text-gray-700">
                            Password
                        </label>
                        <Link
                         href="#"
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            forgot password?
                        </Link>
                        </div>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="########"
                            className="py-5 px-4 text-base rounded-x1"
                        />
                    </div>
                    
                    <Button
                        type="submit"
                        className="w-full py-6 text-base font-medium bg-gradient-to-r from-blue-500 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-x1 shadow-lg"
                    >
                        Sign in
                    </Button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-600"> Don't have an account? </span>
                <Link
                    href="/signup"
                    className="font-semibold text-blue-600 hover:underline"
                >
                    Sign up
                </Link>
            </div>
        </CardContent>
    </Card>
    </div>
)
}