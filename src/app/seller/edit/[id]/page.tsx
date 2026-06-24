import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../../../auth";
import User from "@/models/User";
import Product from "@/models/Product";
import connectDb from "db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ImageUpload } from "../../add/ImageUpload";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    await connectDb();
    const dbUser = await User.findOne({ email: session.user.email });

    if (!dbUser || dbUser.sellerStatus !== 'approved') {
        redirect("/seller");
    }

    const product = await Product.findById(id).lean();

    if (!product) {
        notFound();
    }

    if (product.seller.toString() !== dbUser._id.toString()) {
        redirect("/seller");
    }

    async function updateProductAction(formData: FormData) {
        "use server";
        const session = await auth();
        if (!session?.user?.email) return;

        await connectDb();
        const dbUser = await User.findOne({ email: session.user.email });
        if (!dbUser || dbUser.sellerStatus !== 'approved') return;

        const productId = formData.get("productId") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const condition = formData.get("condition") as string;
        const imageUrl = formData.get("imageUrl") as string;
        const images = imageUrl ? [imageUrl] : [];

        await Product.findByIdAndUpdate(productId, {
            title,
            description,
            price,
            condition,
            images,
        });

        redirect("/seller");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 min-h-screen bg-mesh pb-20">
            <div className="glass p-8 rounded-[2.5rem] border-emerald-500/10">
                <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                    Edit <span className="text-gradient">Product</span>
                </h1>
                <p className="text-slate-400 mt-2 font-medium">Update your product listing.</p>
            </div>

            <Card className="glass border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-700 w-full" />
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-bold text-white">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                    <form action={updateProductAction} className="space-y-6">
                        <input type="hidden" name="productId" value={id} />
                        <div className="space-y-2">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">Title</label>
                            <input
                                name="title"
                                required
                                defaultValue={product.title}
                                className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                defaultValue={product.description}
                                className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">Price (₦)</label>
                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    required
                                    defaultValue={product.price}
                                    className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">Condition</label>
                                <select
                                    name="condition"
                                    required
                                    defaultValue={product.condition}
                                    className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 appearance-none"
                                >
                                    <option value="New" className="bg-slate-900">New</option>
                                    <option value="Like New" className="bg-slate-900">Like New</option>
                                    <option value="Good" className="bg-slate-900">Good</option>
                                    <option value="Fair" className="bg-slate-900">Fair</option>
                                    <option value="Poor" className="bg-slate-900">Poor</option>
                                </select>
                            </div>
                        </div>

                        <ImageUpload initialImage={product.images?.[0]} />

                        <div className="pt-4 flex gap-3 justify-end">
                            <Button variant="outline" type="button" className="border-white/10 text-slate-300 hover:bg-white/[0.05] rounded-xl px-8 py-6 font-bold" asChild>
                                <Link href="/seller">Cancel</Link>
                            </Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-10 py-6 font-bold shadow-xl shadow-emerald-500/10">
                                Update Product
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
