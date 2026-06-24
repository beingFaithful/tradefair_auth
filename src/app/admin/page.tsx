import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../auth";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import connectDb from "db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Shield, Users, ShoppingBag, DollarSign, CheckCircle, XCircle } from "lucide-react";

export default async function AdminDashboard() {
    const session = await auth();
    
    await connectDb();

    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ sellerStatus: 'approved' });
    const pendingSellersCount = await User.countDocuments({ sellerStatus: 'pending' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments({ status: 'paid' });
    const totalRevenue = await Order.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenueAmount = totalRevenue[0]?.total || 0;

    const pendingSellers = await User.find({ sellerStatus: 'pending' }).limit(5).lean();

    async function approveSellerAction(formData: FormData) {
        "use server";
        const userId = formData.get("userId") as string;
        await connectDb();
        await User.findByIdAndUpdate(userId, { 
            sellerStatus: 'approved',
            $addToSet: { role: 'seller' } 
        });
        revalidatePath("/admin");
    }

    async function rejectSellerAction(formData: FormData) {
        "use server";
        const userId = formData.get("userId") as string;
        await connectDb();
        await User.findByIdAndUpdate(userId, { sellerStatus: 'rejected' });
        revalidatePath("/admin");
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Admin <span className="text-gradient">Intelligence</span>
                </h1>
                <p className="text-slate-600 text-sm font-medium tracking-wide mt-1">Real-time status of the Tradefair platform.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: totalUsers, icon: Users, color: "text-amber-300" },
                    { label: "Paid Orders", value: totalOrders, icon: ShoppingBag, color: "text-amber-300" },
                    { label: "Total Revenue", value: `₦${revenueAmount.toLocaleString()}`, icon: DollarSign, color: "text-amber-300" },
                    { label: "Pending Apps", value: pendingSellersCount, icon: Shield, color: "text-amber-300" }
                ].map((stat, i) => (
                    <Card key={i} className="glass border-white/[0.04] shadow-xl hover:translate-y-[-2px] transition-all rounded-[1.5rem]">
                        <CardHeader className="pb-2 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <CardDescription className="font-bold text-slate-600 uppercase tracking-widest text-[10px]">{stat.label}</CardDescription>
                                <stat.icon className="w-4 h-4 text-amber-400/40" />
                            </div>
                            <CardTitle className={`text-2xl font-bold ${stat.color}`}>{stat.value}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass border-white/[0.04] shadow-xl rounded-[1.5rem] overflow-hidden">
                    <CardHeader className="p-6 pb-3">
                        <CardTitle className="text-lg font-bold text-white tracking-tight">Recent Applications</CardTitle>
                        <CardDescription className="text-slate-600 text-sm">New seller requests awaiting verification.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {pendingSellers.length === 0 ? (
                            <div className="p-12 text-center text-slate-600 font-medium text-sm">
                                No pending applications.
                            </div>
                        ) : (
                            <ul className="divide-y divide-white/[0.03]">
                                {pendingSellers.map((seller: any) => (
                                    <li key={seller._id.toString()} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.01] transition-colors">
                                        <div>
                                            <p className="font-semibold text-white text-sm">{seller.email}</p>
                                            <p className="text-xs text-slate-600 font-medium mt-1">{new Date(seller.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <form action={approveSellerAction}>
                                                <input type="hidden" name="userId" value={seller._id.toString()} />
                                                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-5 py-4 text-xs font-bold">
                                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                    Approve
                                                </Button>
                                            </form>
                                            <form action={rejectSellerAction}>
                                                <input type="hidden" name="userId" value={seller._id.toString()} />
                                                <Button size="sm" variant="outline" className="border-rose-500/10 text-rose-400 hover:bg-rose-500/5 rounded-full px-5 py-4 text-xs font-bold">
                                                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                                                    Reject
                                                </Button>
                                            </form>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass border-white/[0.04] shadow-xl rounded-[1.5rem]">
                    <CardHeader className="p-6 pb-3">
                        <CardTitle className="text-lg font-bold text-white tracking-tight">Operations</CardTitle>
                        <CardDescription className="text-slate-600 text-sm">Core administrative tools.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-2 space-y-2.5">
                        {[
                            { href: "/admin/orders", label: "Monitor Global Orders" },
                            { href: "/admin/sellers", label: "Manage Seller Applications" },
                            { href: "/admin/special-ids", label: "Generate Access IDs" },
                            { href: "/admin/users", label: "Manage All Users" },
                            { href: "/admin/products", label: "Product Moderation" }
                        ].map((action, i) => (
                            <Button key={i} variant="outline" className="w-full justify-start py-4 rounded-xl border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] text-sm font-medium text-slate-400 hover:text-white" asChild>
                                <a href={action.href}>{action.label}</a>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
