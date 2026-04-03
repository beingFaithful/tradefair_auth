import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getSession } from "auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getSession()
    if (!session) redirect("/login")

return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
            <header className= "flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold text-gray-800"> Your Dashboard</h1>
                <form action={'logoutAction'}>
                <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                >
                    Sign Out
                </Button>
                </form>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-0 shadow-md rounded-x1">
                    <CardHeader>
                        <CardTitle className="text-gray-700">Account Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-gray-600">Email: {session.email}</p>
                            <p className="text-gray-600">User ID: {session.userId}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-md rounded-x1">
                    <CardHeader>
                        <CardTitle className="text-gray-700">Security Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-gray-600">Session Encrypted</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-gray-600">HTTP-only cookies</span>
                            </div>
                                <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-gray-600">Password Hashed</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-md rounded-x1">
                    <CardHeader>
                        <CardTitle className="text-gray-700">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            </Button>
                            <Button variant="outline" className="w-full">
                                Change password
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className = "mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                    Authentication Flow Explained 
                </h2>
                <ol className= "Space-y-4 text-blue-700">
                    <li>1. User credentials virified against database</li>
                    <li>2. JWT token created with user payload</li>
                    <li>3. Token stored in HTTP-only cookie</li>
                    <li>4. All requests automatically include cookie</li>
                    <li>5. Middleware verifies token on protected routes</li>
                </ol>
            </div>

        </div>
    </div>
    )
}
