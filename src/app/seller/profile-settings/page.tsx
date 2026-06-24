import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../../auth";
import User from "@/models/User";
import connectDb from "db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ImageUpload } from "../add/ImageUpload";

export default async function ProfileSettingsPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    await connectDb();
    const dbUser = await User.findOne({ email: session.user.email });

    if (!dbUser || dbUser.sellerStatus !== 'approved') {
        redirect('/seller');
    }

    async function updateProfileAction(formData: FormData) {
        "use server";
        const session = await auth();
        if (!session?.user?.email) return;

        await connectDb();
        const update: Record<string, string> = {};
        const sellerName = formData.get("sellerName") as string;
        const bio = formData.get("bio") as string;
        const profilePicture = formData.get("profilePicture") as string;

        if (sellerName) update.sellerName = sellerName;
        if (bio) update.bio = bio;
        if (profilePicture) update.profilePicture = profilePicture;

        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
            Object.assign(dbUser, update);
            await dbUser.save();
        }

        revalidatePath("/seller/profile-settings");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 min-h-screen bg-mesh pb-20">
            <div className="glass p-8 rounded-[2.5rem] border-emerald-500/10">
                <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                    Profile <span className="text-gradient">Settings</span>
                </h1>
                <p className="text-slate-400 mt-2 font-medium">Customize your seller profile visible to buyers.</p>
            </div>

            <Card className="glass border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-700 w-full" />
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-bold text-white">Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                    <form action={updateProfileAction} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">Brand / Seller Name</label>
                            <input
                                name="sellerName"
                                defaultValue={dbUser.sellerName || ''}
                                placeholder="e.g. Faith's Bookstore"
                                className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">Profile Picture URL</label>
                            <ImageUpload initialImage={dbUser.profilePicture || ''} inputName="profilePicture" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">Bio</label>
                            <textarea
                                name="bio"
                                rows={4}
                                defaultValue={dbUser.bio || ''}
                                maxLength={500}
                                placeholder="Tell buyers about yourself and what you sell..."
                                className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 resize-none"
                            />
                            <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wider px-1">Max 500 characters</p>
                        </div>

                        <div className="pt-4 flex gap-3 justify-end">
                            <Button variant="outline" type="button" className="border-white/10 text-slate-300 hover:bg-white/[0.05] rounded-xl px-8 py-6 font-bold" asChild>
                                <Link href="/seller">Cancel</Link>
                            </Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-10 py-6 font-bold shadow-xl shadow-emerald-500/10">
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
