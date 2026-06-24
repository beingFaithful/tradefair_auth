import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import User from "@/models/User";
import Product from "@/models/Product";
import connectDb from "db";
import Link from "next/link";
import ApplySellerButton from "@/components/ApplySellerButton";
import MessageSellerButton from "@/components/MessageSellerButton";
import BuyButton from "@/components/BuyButton";
import { ShoppingBag, Store, UserCircle } from "lucide-react";

export default async function BuyerDashboard() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    await connectDb();
    const dbUser = await User.findOne({ email: session.user.email });

    if (dbUser?.role?.includes('admin')) {
        redirect('/admin');
    }

    const products = await Product.find({ status: 'available' }).sort({ createdAt: -1 }).populate('seller', 'email sellerName firstName lastName').lean();

    return (
        <div className="space-y-12 pb-20">
            {/* Welcome Header */}
            <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <div className="pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                                {dbUser?.firstName?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                    Welcome back, <span className="text-gradient">{dbUser?.firstName ? dbUser.firstName : 'Student'}</span>
                                </h1>
                                <p className="text-slate-600 text-sm font-medium tracking-wide">Browse the marketplace</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {dbUser?.sellerStatus === 'none' && <ApplySellerButton />}
                        {dbUser?.sellerStatus === 'pending' && (
                            <div className="px-5 py-2.5 rounded-full bg-amber-500/5 border border-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                Application Pending
                            </div>
                        )}
                        {dbUser?.sellerStatus === 'approved' && (
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-7 py-5 shadow-lg shadow-amber-500/10 text-sm font-bold tracking-wide" asChild>
                                <a href="/seller">
                                    <Store className="w-4 h-4 mr-2" />
                                    Seller Dashboard
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.length === 0 ? (
                    <div className="col-span-full glass p-20 rounded-[2rem] border-white/[0.04] text-center">
                        <div className="w-20 h-20 bg-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
                            <ShoppingBag className="w-10 h-10 text-amber-400/60" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Marketplace Empty</h3>
                        <p className="text-slate-600 mb-6 font-light">No products available yet. Check back soon or be the first to list an item!</p>
                        {dbUser?.sellerStatus === 'approved' && (
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 py-5 shadow-xl shadow-amber-500/10 font-bold" asChild>
                                <a href="/seller/add">List Your First Product</a>
                            </Button>
                        )}
                    </div>
                ) : (
                    products.map((product: any) => (
                        <Card key={product._id.toString()} className="group glass border-white/[0.04] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden rounded-[1.5rem]">
                            <div className="aspect-[4/5] w-full bg-slate-900 overflow-hidden relative">
                                {product.images && product.images.length > 0 ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
                                        <ShoppingBag className="w-12 h-12 text-amber-500/10" />
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="text-2xl font-bold text-amber-300 tracking-tight drop-shadow-lg">₦{product.price.toLocaleString()}</div>
                                </div>
                            </div>
                            <CardHeader className="pb-2 pt-5 px-5">
                                <CardTitle className="text-base text-white font-bold line-clamp-1 tracking-tight">{product.title}</CardTitle>
                                {product.seller && (
                                    <Link href={`/profile/${(product.seller as any)._id}`} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-300 font-medium transition-colors mt-1.5">
                                        <UserCircle className="w-3.5 h-3.5" />
                                        <span>{(product.seller as any).sellerName || `${(product.seller as any).firstName} ${(product.seller as any).lastName}` || (product.seller as any).email}</span>
                                    </Link>
                                )}
                            </CardHeader>
                            <CardContent className="pb-3 px-5 flex-grow">
                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">{product.description}</p>
                            </CardContent>
                            <CardFooter className="pt-3 pb-5 px-5 gap-2.5 mt-auto border-t border-white/[0.03] bg-white/[0.01]">
                                <BuyButton productId={product._id.toString()} />
                                <MessageSellerButton productId={product._id.toString()} />
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
