import { ReactNode } from "react"
import Link from "next/link"
import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { auth } from "../../../auth"
import { redirect } from "next/navigation"
import User from "@/models/User"
import connectDb from "db"
import MobileNav from "@/components/MobileNav"

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth()

    if (!session || !session.user?.email) {
        redirect("/login")
    }

    await connectDb();
    const user = await User.findOne({ email: session.user.email });

    if (!user?.role?.includes('admin')) {
        redirect("/buyer")
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", active: true },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/products", label: "Moderation" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col bg-mesh">
            <header className="bg-background/50 backdrop-blur-2xl border-b border-white/[0.03] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/10">
                                <span className="text-white font-black text-xl">T</span>
                            </div>
                            <span className="text-xl font-bold text-white/90 tracking-widest uppercase">Admin</span>
                        </div>

                        <nav className="hidden md:flex items-center space-x-1">
                            <Link href="/admin" className="px-6 py-2 rounded-full text-amber-300 font-semibold bg-amber-500/5 border border-amber-500/15 transition-all text-sm tracking-wide">
                                Dashboard
                            </Link>
                            <Link href="/admin/users" className="px-6 py-2 rounded-full text-slate-500 hover:text-slate-300 font-medium transition-all text-sm tracking-wide">
                                Users
                            </Link>
                            <Link href="/admin/products" className="px-6 py-2 rounded-full text-slate-500 hover:text-slate-300 font-medium transition-all text-sm tracking-wide">
                                Moderation
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <MobileNav items={navItems} />
                            <div className="hidden sm:block text-right">
                                <p className="text-white font-semibold text-sm leading-none">{session.user?.email}</p>
                                <p className="text-amber-400/50 text-[10px] font-bold uppercase tracking-widest mt-1">Administrator</p>
                            </div>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {children}
                </div>
            </main>
        </div>
    )
}
