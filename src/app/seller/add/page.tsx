import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../../auth";
import User from "@/models/User";
import Product from "@/models/Product";
import connectDb from "db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ImageUpload } from "./ImageUpload";

export default async function AddProductPage() {
    const session = await auth();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    async function addProductAction(formData: FormData) {
        "use server";
        const session = await auth();
        if (!session?.user?.email) return;

        await connectDb();
        const dbUser = await User.findOne({ email: session.user.email });

        if (!dbUser || dbUser.sellerStatus !== 'approved') {
            throw new Error("Not authorized");
        }

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const condition = formData.get("condition") as string;
        const imageUrl = formData.get("imageUrl") as string;
        const images = imageUrl ? [imageUrl] : [];

        const product = new Product({
            title,
            description,
            price,
            condition,
            seller: dbUser._id,
            images,
            status: 'available'
        });

        await product.save();
        revalidatePath("/seller");
        redirect("/seller");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none">
                    Add <span className="text-gradient">Product</span>
                </h1>
                <p className="text-slate-600 text-sm font-medium tracking-wide mt-1">List a new item in the marketplace.</p>
            </div>

            <Card className="glass border-white/[0.04] shadow-xl rounded-[1.5rem] overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-amber-500/40 via-amber-400/60 to-amber-500/40 w-full" />
                <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-lg font-bold text-white tracking-tight">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                    <form action={addProductAction} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Title</label>
                            <input
                                name="title"
                                required
                                placeholder="e.g. Calculus Textbook"
                                className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                placeholder="Describe your item in detail..."
                                className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 resize-none text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Price (₦)</label>
                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    required
                                    placeholder="0.00"
                                    className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Condition</label>
                                <select
                                    name="condition"
                                    required
                                    className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 appearance-none text-sm"
                                >
                                    <option value="New" className="bg-slate-900">New</option>
                                    <option value="Like New" className="bg-slate-900">Like New</option>
                                    <option value="Good" className="bg-slate-900">Good</option>
                                    <option value="Fair" className="bg-slate-900">Fair</option>
                                    <option value="Poor" className="bg-slate-900">Poor</option>
                                </select>
                            </div>
                        </div>

                        <ImageUpload />

                        <div className="pt-4 flex gap-3 justify-end">
                            <Button variant="outline" type="button" className="border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.03] rounded-xl px-6 py-4 text-sm font-medium" asChild>
                                <Link href="/seller">Cancel</Link>
                            </Button>
                            <Button type="submit" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl px-8 py-4 text-sm font-bold tracking-wide shadow-xl shadow-amber-500/10">
                                Save Product
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
