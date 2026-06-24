import { ReactNode } from "react"
import Link from "next/link"
import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { auth } from "../../../auth"
import { redirect } from "next/navigation"
import User from "@/models/User"
import connectDb from "db"
import MobileNav from "@/components/MobileNav"

export default async function SellerLayout({ children }: { children: ReactNode }) {
    const session = await auth()

    if (!session || !session.user?.email) {
        redirect("/login")
    }

    await connectDb();
    const user = await User.findOne({ email: session.user.email });

    if (user?.sellerStatus !== 'approved') {
        redirect("/buyer")
    }

    const navItems = [
        { href: "/seller", label: "My Products", active: true },
        { href: "/seller/orders", label: "Sales" },
        { href: "/seller/chats", label: "Messages" },
        { href: "/seller/profile-settings", label: "Profile" },
        ...(user?.role?.includes('admin') ? [{ href: "/admin", label: "Admin" }] : []),
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col bg-mesh">
            <header className="bg-background/50 backdrop-blur-2xl border-b border-white/[0.03] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/10">
                                <span className="text-white font-black text-xl">S</span>
                            </div>
                            <span className="text-xl font-bold text-white/90 tracking-widest uppercase">Seller Hub</span>
                        </div>

                        <nav className="hidden md:flex items-center space-x-1">
                            <Link href="/seller" className="px-6 py-2 rounded-full text-amber-300 font-semibold bg-amber-500/5 border border-amber-500/15 transition-all text-sm tracking-wide">
                                My Products
                            </Link>
                            <Link href="/seller/orders" className="px-6 py-2 rounded-full text-slate-500 hover:text-slate-300 font-medium transition-all text-sm tracking-wide">
                                Sales
                            </Link>
                            <Link href="/seller/chats" className="px-6 py-2 rounded-full text-slate-500 hover:text-slate-300 font-medium transition-all text-sm tracking-wide">
                                Messages
                            </Link>
                            <Link href="/seller/profile-settings" className="px-6 py-2 rounded-full text-slate-500 hover:text-slate-300 font-medium transition-all text-sm tracking-wide">
                                Profile
                            </Link>
                            {user?.role?.includes('admin') && (
                                <Link href="/admin" className="px-6 py-2 rounded-full text-rose-400 hover:text-rose-300 font-medium transition-all text-sm tracking-wide">
                                    Admin
                                </Link>
                            )}
                        </nav>

                        <div className="flex items-center gap-4">
                            <MobileNav items={navItems} />
                            <Link href="/buyer" className="hidden sm:block text-sm font-medium text-slate-500 hover:text-amber-400 transition-colors tracking-wide">
                                Switch to Buyer
                            </Link>
                            <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-amber-300 font-bold shadow-inner">
                                {session.user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <form action={logoutAction}>
                                <Button variant="ghost" className="text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 rounded-full px-6 transition-all font-medium text-sm">
                                    Logout
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
