import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../auth";
import User from "@/models/User";
import Product from "@/models/Product";
import connectDb from "db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Package, Store, Trash2, Edit } from "lucide-react";
import { revalidatePath } from "next/cache";
import { SellerBrandSection } from "./SellerBrandSection";

export default async function SellerDashboard() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    await connectDb();
    const dbUser = await User.findOne({ email: session.user.email });

    if (!dbUser) {
        redirect('/login');
    }

    if (!dbUser.role?.includes('seller') || dbUser.sellerStatus !== 'approved') {
        redirect('/buyer');
    }

    const products = await Product.find({ seller: dbUser._id }).sort({ createdAt: -1 }).lean();

    async function updateSellerNameAction(formData: FormData) {
        "use server";
        const session = await auth();
        if (!session?.user?.email) return;
        await connectDb();
        const sellerName = formData.get("sellerName") as string;
        await User.findOneAndUpdate({ email: session.user.email }, { sellerName: sellerName || undefined });
        revalidatePath("/seller");
    }

    async function deleteProductAction(formData: FormData) {
        "use server";
        const session = await auth();
        if (!session?.user?.email) return;
        await connectDb();
        const dbUser = await User.findOne({ email: session.user.email });
        if (!dbUser || dbUser.sellerStatus !== 'approved') return;
        const productId = formData.get("productId") as string;
        const product = await Product.findById(productId);
        if (!product || product.seller.toString() !== dbUser._id.toString()) return;
        await Product.findByIdAndDelete(productId);
        revalidatePath("/seller");
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <div className="pt-8 pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            My <span className="text-gradient">Products</span>
                        </h1>
                        <p className="text-slate-600 text-sm font-medium tracking-wide mt-1">Manage your inventory and listings.</p>
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-7 py-5 shadow-xl shadow-amber-500/10 text-sm font-bold tracking-wide" asChild>
                        <Link href="/seller/add">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Link>
                    </Button>
                </div>
            </div>

            <SellerBrandSection sellerName={dbUser.sellerName} updateAction={updateSellerNameAction} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.length === 0 ? (
                    <div className="col-span-full glass p-20 rounded-[2rem] border-white/[0.04] text-center">
                        <div className="w-20 h-20 bg-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
                            <Package className="w-10 h-10 text-amber-400/60" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No products yet</h3>
                        <p className="text-slate-600 mb-6 font-light">Add your first product to start selling.</p>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 py-5 shadow-xl shadow-amber-500/10 font-bold" asChild>
                            <Link href="/seller/add">Add Product</Link>
                        </Button>
                    </div>
                ) : (
                    products.map((product: any) => (
                        <Card key={product._id.toString()} className="group glass border-white/[0.04] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden rounded-[1.5rem]">
                            {product.images && product.images.length > 0 ? (
                                <div className="aspect-square w-full bg-slate-900 overflow-hidden relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </div>
                            ) : (
                                <div className="aspect-square w-full bg-slate-800/50 flex items-center justify-center">
                                    <Package className="w-12 h-12 text-amber-500/10" />
                                </div>
                            )}
                            <CardHeader className="pb-2 pt-5 px-5">
                                <CardTitle className="text-base text-white font-bold line-clamp-1 tracking-tight">{product.title}</CardTitle>
                                <div className="text-xl font-bold text-amber-300 mt-1.5 tracking-tight">₦{product.price.toLocaleString()}</div>
                            </CardHeader>
                            <CardFooter className="pt-4 pb-5 px-5 flex gap-2.5 border-t border-white/[0.03] bg-white/[0.01]">
                                <Button variant="outline" className="flex-1 border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/10 rounded-xl text-sm font-medium" asChild>
                                    <Link href={`/seller/edit/${product._id}`}>
                                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                                        Edit
                                    </Link>
                                </Button>
                                <form action={deleteProductAction} className="flex-1">
                                    <input type="hidden" name="productId" value={product._id.toString()} />
                                    <Button variant="destructive" type="submit" className="w-full bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border border-rose-500/10 rounded-xl text-sm font-medium">
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                        Delete
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
