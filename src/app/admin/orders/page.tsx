import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { auth } from "../../../../auth";
import Order from "@/models/Order";
import User from "@/models/User";
import connectDb from "db";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    await connectDb();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser?.role?.includes('admin')) {
        redirect("/buyer");
    }

    const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('buyer', 'email')
        .populate('product', 'title price')
        .lean();

    return (
        <div className="space-y-8 pb-20">
            <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Order <span className="text-gradient">Monitoring</span>
                </h1>
                <p className="text-slate-600 text-sm font-medium tracking-wide mt-1">Global view of all transactions on Tradefair.</p>
            </div>

            <Card className="glass border-white/[0.04] shadow-xl rounded-[1.5rem] overflow-hidden">
                <CardHeader className="p-6 pb-3">
                    <CardTitle className="text-lg font-bold text-white tracking-tight">Global Transactions</CardTitle>
                    <CardDescription className="text-slate-600 text-sm">Monitor payments and fulfillment status.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01] border-b border-white/[0.03]">
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Reference</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Product</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Buyer</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Amount</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Status</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-slate-600 font-medium">No orders found.</td>
                                    </tr>
                                ) : (
                                    orders.map((order: any) => (
                                        <tr key={order._id.toString()} className="hover:bg-white/[0.01] transition-colors text-sm">
                                            <td className="p-5 font-mono text-xs text-slate-600">{order.paystackReference || '—'}</td>
                                            <td className="p-5 font-semibold text-white">{(order.product as any)?.title || 'Deleted Product'}</td>
                                            <td className="p-5 text-slate-500">{(order.buyer as any)?.email}</td>
                                            <td className="p-5 font-bold text-amber-300">₦{order.amount.toLocaleString()}</td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    order.status === 'paid' ? 'bg-amber-500/5 text-amber-300 border border-amber-500/10' :
                                                    order.status === 'pending' ? 'bg-yellow-500/5 text-yellow-300 border border-yellow-500/10' :
                                                    'bg-rose-500/5 text-rose-300 border border-rose-500/10'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-slate-600 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString()}
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
