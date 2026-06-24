import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import User from "@/models/User";
import connectDb from "db";
import Link from "next/link";
import ApplySellerButton from "@/components/ApplySellerButton";

export default async function Dashboard() {
    const session = await auth();
    let dbUser = null;

    if (session?.user?.email) {
        await connectDb();
        dbUser = await User.findOne({ email: session.user.email });

        if (dbUser?.role?.includes('admin')) {
            redirect('/admin');
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                        Welcome back, <span className="text-gradient">{dbUser?.firstName || 'Student'}</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Here is a quick overview of your account status.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-white/5 shadow-xl hover:translate-y-[-4px] transition-all">
                    <CardHeader className="pb-2">
                        <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Account Status</CardDescription>
                        <CardTitle className="text-4xl font-extrabold text-white">{session?.user?.email ? 'Active' : 'Inactive'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-emerald-400 font-bold flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Account secured via Auth.js
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 shadow-xl hover:translate-y-[-4px] transition-all">
                    <CardHeader className="pb-2">
                        <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Member Since</CardDescription>
                        <CardTitle className="text-4xl font-extrabold text-white">
                            {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Today'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 font-bold flex items-center mt-1">
                            {dbUser?.department || 'Tradefair Community'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 shadow-xl hover:translate-y-[-4px] transition-all bg-gradient-to-br from-emerald-600/20 to-green-900/20 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                    <CardHeader className="pb-2 relative">
                        <CardDescription className="font-bold text-emerald-400/60 uppercase tracking-widest text-[10px]">Role</CardDescription>
                        <CardTitle className="text-4xl font-extrabold text-white tracking-tight">
                            {dbUser?.role?.join(', ') || 'Buyer'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-sm text-emerald-400/80 font-bold flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {dbUser?.sellerStatus === 'approved' ? 'Authorized Seller' : dbUser?.sellerStatus === 'pending' ? 'Seller Application Pending' : 'Marketplace Member'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 glass border-white/5 shadow-xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-bold text-white">Account Overview</CardTitle>
                        <CardDescription className="text-slate-500">Your profile details and account status.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <div className="space-y-4">
                            {[
                                { label: "Name", value: dbUser?.firstName ? `${dbUser.firstName} ${dbUser.lastName || ''}` : '—' },
                                { label: "Email", value: session?.user?.email || '—' },
                                { label: "Department", value: dbUser?.department || '—' },
                                { label: "Level", value: dbUser?.level || '—' },
                                { label: "College", value: dbUser?.college || '—' },
                                { label: "Gender", value: dbUser?.gender || '—' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-sm font-bold text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 shadow-xl rounded-[2rem] flex flex-col overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-2xl font-bold text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col p-8 pt-4 space-y-3">
                        <Link href="/forgot-password" className="w-full">
                            <Button variant="outline" className="w-full justify-start py-8 rounded-2xl border-white/5 bg-white/[0.02] text-white hover:bg-white/[0.05] font-bold">
                                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Reset Password
                            </Button>
                        </Link>

                        {!dbUser?.isAuthorizedSeller && (
                            <ApplySellerButton />
                        )}

                        <Link href="/buyer" className="w-full">
                            <Button variant="outline" className="w-full justify-start py-8 rounded-2xl border-white/5 bg-white/[0.02] text-white hover:bg-white/[0.05] font-bold">
                                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Browse Marketplace
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
