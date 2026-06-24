import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../../auth";
import Product from "@/models/Product";
import User from "@/models/User";
import connectDb from "db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AdminProductsPage() {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    await connectDb();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser?.role?.includes('admin')) {
        redirect("/buyer");
    }

    const products = await Product.find().sort({ createdAt: -1 }).populate('seller', 'email').lean();

    async function deleteProductAction(formData: FormData) {
        "use server";
        const productId = formData.get("productId") as string;
        await connectDb();
        await Product.findByIdAndDelete(productId);
        revalidatePath("/admin/products");
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Product <span className="text-gradient">Oversight</span>
                </h1>
                <p className="text-slate-600 text-sm font-medium tracking-wide mt-1">Review and moderate all active marketplace listings.</p>
            </div>

            <Card className="glass border-white/[0.04] shadow-xl rounded-[1.5rem] overflow-hidden">
                <CardHeader className="p-6 pb-3">
                    <CardTitle className="text-lg font-bold text-white tracking-tight">Global Product List</CardTitle>
                    <CardDescription className="text-slate-600 text-sm">All items currently listed on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01] border-b border-white/[0.03]">
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Product</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Seller</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Price</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Status</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Listed On</th>
                                    <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-slate-600 font-medium">No products found.</td>
                                    </tr>
                                ) : (
                                    products.map((product: any) => (
                                        <tr key={product._id.toString()} className="hover:bg-white/[0.01] transition-colors text-sm">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    {product.images && product.images[0] ? (
                                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] overflow-hidden border border-white/[0.04]">
                                                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-white/[0.02] flex items-center justify-center text-slate-700 border border-white/[0.04]">
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <span className="font-semibold text-white">{product.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-slate-500">{product.seller?.email}</td>
                                            <td className="p-5 font-bold text-amber-300">₦{product.price.toLocaleString()}</td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    product.status === 'available' ? 'bg-amber-500/5 text-amber-300 border border-amber-500/10' :
                                                    product.status === 'sold' ? 'bg-blue-500/5 text-blue-300 border border-blue-500/10' :
                                                    'bg-white/[0.02] text-slate-600 border border-white/[0.04]'
                                                }`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-slate-600 font-medium">
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-5">
                                                <form action={deleteProductAction}>
                                                    <input type="hidden" name="productId" value={product._id.toString()} />
                                                    <Button size="sm" variant="ghost" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-full px-4 font-medium text-xs">
                                                        Delete
                                                    </Button>
                                                </form>
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
