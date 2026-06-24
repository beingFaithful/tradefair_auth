import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth } from "../../../../auth";
import User from "@/models/User";
import Order from "@/models/Order";
import connectDb from "db";
import { redirect } from "next/navigation";
import { DollarSign, Package } from "lucide-react";

export default async function SellerOrdersPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    await connectDb();
    const dbUser = await User.findOne({ email: session.user.email });

    if (!dbUser || dbUser.sellerStatus !== 'approved') {
        redirect('/seller');
    }

    const orders = await Order.find({ seller: dbUser._id })
        .sort({ createdAt: -1 })
        .populate('product', 'title price images status')
        .populate('buyer', 'email firstName lastName')
        .lean();

    return (
        <div className="space-y-10 pb-20">
            <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none">
                    <span className="text-gradient">Sales</span> History
                </h1>
                <p className="text-slate-600 text-sm font-medium tracking-wide mt-1">Track who bought your products.</p>
            </div>

            {orders.length === 0 ? (
                <div className="glass p-20 rounded-[2rem] border-white/[0.04] text-center">
                    <div className="w-20 h-20 bg-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
                        <DollarSign className="w-10 h-10 text-amber-400/60" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No Sales Yet</h3>
                    <p className="text-slate-600 font-light">Your products haven&apos;t been purchased yet. Keep promoting!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <Card key={order._id.toString()} className="glass border-white/[0.04] shadow-xl rounded-[1.5rem] overflow-hidden hover:translate-y-[-2px] transition-all">
                            <div className="p-6 flex flex-col sm:flex-row gap-6">
                                {order.product?.images?.[0] && (
                                    <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800/50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={order.product.images[0]} alt={order.product.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-grow space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <h3 className="text-lg font-bold text-white tracking-tight">{order.product?.title || 'Deleted Product'}</h3>
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start ${
                                            order.status === 'paid' ? 'bg-amber-500/5 text-amber-300 border border-amber-500/10' :
                                            order.status === 'pending' ? 'bg-yellow-500/5 text-yellow-300 border border-yellow-500/10' :
                                            order.status === 'completed' ? 'bg-blue-500/5 text-blue-300 border border-blue-500/10' :
                                            'bg-rose-500/5 text-rose-300 border border-rose-500/10'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-amber-300">₦{order.amount.toLocaleString()}</p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
                                        <span>Buyer: {order.buyer?.firstName || order.buyer?.email}</span>
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        {order.paystackReference && (
                                            <span className="font-mono text-xs">Ref: {order.paystackReference}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
