import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { auth } from "../../../../auth";
import User from "@/models/User";
import connectDb from "db";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    await connectDb();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser?.role?.includes('admin')) {
        redirect("/buyer");
    }

    const allUsers = await User.find().sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-8 pb-20">
            <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    User <span className="text-gradient">Management</span>
                </h1>
                <p className="text-slate-600 text-sm font-medium tracking-wide mt-1">View and manage all registered accounts.</p>
            </div>

            <Card className="glass border-white/[0.04] shadow-xl rounded-[1.5rem] overflow-hidden">
                <CardHeader className="p-6 pb-3">
                    <CardTitle className="text-lg font-bold text-white tracking-tight">Platform Users</CardTitle>
                    <CardDescription className="text-slate-600 text-sm">All students, alumni, and administrators.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01] border-b border-white/[0.03]">
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Email / ID</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Type</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Roles</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Seller Status</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {allUsers.map((user: any) => (
                                    <tr key={user._id.toString()} className="hover:bg-white/[0.01] transition-colors text-sm">
                                        <td className="p-5 font-semibold text-white">{user.email}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                user.identifierType === 'student_email' ? 'bg-amber-500/5 text-amber-300 border border-amber-500/10' : 'bg-purple-500/5 text-purple-300 border border-purple-500/10'
                                            }`}>
                                                {user.identifierType ? user.identifierType.replace('_', ' ') : 'OAuth / Legacy'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {(user.role || ['buyer']).map((r: string) => (
                                                    <span key={r} className="px-3 py-1 rounded-full bg-white/[0.03] text-slate-500 text-[10px] uppercase font-bold tracking-wider border border-white/[0.04]">
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                user.sellerStatus === 'approved' ? 'bg-amber-500/5 text-amber-300 border border-amber-500/10' :
                                                user.sellerStatus === 'pending' ? 'bg-yellow-500/5 text-yellow-300 border border-yellow-500/10' :
                                                user.sellerStatus === 'rejected' ? 'bg-rose-500/5 text-rose-300 border border-rose-500/10' :
                                                'bg-white/[0.02] text-slate-600 border border-white/[0.04]'
                                            }`}>
                                                {user.sellerStatus || 'none'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-slate-600 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
