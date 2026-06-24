import { redirect, notFound } from "next/navigation";
import User from "@/models/User";
import Product from "@/models/Product";
import connectDb from "db";
import Link from "next/link";
import { Package, Store, ArrowLeft, UserCircle } from "lucide-react";
import { ChatSellerButton } from "./ChatSellerButton";

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await connectDb();
    const seller = await User.findById(id).lean();

    if (!seller || seller.sellerStatus !== 'approved') {
        notFound();
    }

    const products = await Product.find({ seller: id, status: 'available' })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();

    const displayName = seller.sellerName || `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller.email;

    return (
        <div className="min-h-screen bg-mesh pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link href="/buyer" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-amber-300 transition-colors mb-6 font-medium tracking-wide">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Marketplace
                </Link>
            </div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                    <div className="glass pt-14 pb-12 px-8 rounded-[2rem] border-white/[0.04] text-center mt-6">
                        <div className="w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden border-2 border-amber-500/20 bg-slate-800/50 shadow-2xl shadow-amber-500/5">
                            {seller.profilePicture ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={seller.profilePicture} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-amber-400/60">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                            {displayName}
                        </h1>
                        {seller.bio && (
                            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base leading-relaxed font-light">{seller.bio}</p>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-600 font-medium tracking-wide uppercase">
                            <Store className="w-3.5 h-3.5" />
                            <span>Seller on Tradefair</span>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <ChatSellerButton sellerId={id} />
                        </div>
                    </div>
                </div>

                {products.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 tracking-tight">
                            <Package className="w-5 h-5 text-amber-400/60" />
                            Listings
                            <span className="text-sm font-medium text-slate-600">({products.length})</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {products.map((product: any) => (
                                <Link key={product._id.toString()} href={`/buyer`} className="group block">
                                    <div className="glass border-white/[0.04] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-[1.5rem]">
                                        {product.images?.[0] ? (
                                            <div className="aspect-square bg-slate-900 overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                                            </div>
                                        ) : (
                                            <div className="aspect-square bg-slate-800/50 flex items-center justify-center">
                                                <Package className="w-12 h-12 text-amber-500/10" />
                                            </div>
                                        )}
                                        <div className="p-4 space-y-1.5">
                                            <h3 className="font-bold text-white line-clamp-1 text-sm tracking-tight">{product.title}</h3>
                                            <p className="text-lg font-bold text-amber-300">₦{product.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {products.length === 0 && (
                    <div className="glass p-20 rounded-[2rem] border-white/[0.04] text-center">
                        <div className="w-20 h-20 bg-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
                            <Package className="w-10 h-10 text-amber-400/60" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No Listings Yet</h3>
                        <p className="text-slate-600 font-light">This seller hasn&apos;t listed any products.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
