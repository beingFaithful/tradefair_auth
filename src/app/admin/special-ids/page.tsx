import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../../auth";
import SpecialID from "@/models/SpecialID";
import User from "@/models/User";
import connectDb from "db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Plus } from "lucide-react";

export default async function SpecialIDsPage() {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    await connectDb();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser?.role?.includes('admin')) {
        redirect("/buyer");
    }

    const specialIDs = await SpecialID.find().sort({ createdAt: -1 }).populate('claimedBy', 'email').lean();

    async function generateIDAction() {
        "use server";
        const session = await auth();
        if (!session?.user?.email) return;

        await connectDb();
        const adminUser = await User.findOne({ email: session.user.email });
        if (!adminUser) return;

        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const code = `MTU-EXT-${randomStr}`;

        await SpecialID.create({
            code,
            generatedBy: adminUser._id
        });

        revalidatePath("/admin/special-ids");
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative pt-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Special <span className="text-gradient">Access IDs</span>
                    </h1>
                    <p className="text-slate-600 text-sm font-medium tracking-wide mt-1">Generate codes for alumni and external members.</p>
                </div>
                <form action={generateIDAction}>
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-6 py-5 shadow-xl shadow-amber-500/10 text-sm font-bold">
                        <Plus className="w-4 h-4 mr-2" />
                        Generate New ID
                    </Button>
                </form>
            </div>

            <Card className="glass border-white/[0.04] shadow-xl rounded-[1.5rem] overflow-hidden">
                <CardHeader className="p-6 pb-3">
                    <CardTitle className="text-lg font-bold text-white tracking-tight">Active Access Codes</CardTitle>
                    <CardDescription className="text-slate-600 text-sm">Codes that can be used during registration.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01] border-b border-white/[0.03]">
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Access Code</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Status</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Claimed By</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Generated On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {specialIDs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-slate-600 font-medium">No IDs generated yet.</td>
                                    </tr>
                                ) : (
                                    specialIDs.map((id: any) => (
                                        <tr key={id._id.toString()} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="p-5 font-mono font-bold text-amber-300 tracking-wider">{id.code}</td>
                                            <td className="p-5">
                                                {id.isClaimed ? (
                                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/[0.03] text-slate-600 border border-white/[0.04]">Claimed</span>
                                                ) : (
                                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/5 text-amber-300 border border-amber-500/10">Available</span>
                                                )}
                                            </td>
                                            <td className="p-5 text-slate-500">
                                                {id.claimedBy?.email || "—"}
                                            </td>
                                            <td className="p-5 text-slate-600 font-medium">
                                                {new Date(id.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
