import { ReactNode } from "react"
import Link from "next/link"
import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { auth } from "../../../auth"
import { redirect } from "next/navigation"
import MobileNav from "@/components/MobileNav"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const navItems = [
        { href: "/dashboard", label: "Overview", active: true },
        { href: "#", label: "Analytics" },
        { href: "#", label: "Settings" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col bg-mesh">
            <header className="bg-background/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 shadow-2xl shadow-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <span className="text-white font-black text-2xl tracking-tighter">T</span>
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">Tradefair</span>
                        </div>

                        <nav className="hidden md:flex items-center space-x-1">
                            <Link href="/dashboard" className="px-6 py-2 rounded-full text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 transition-all">
                                Overview
                            </Link>
                            <Link href="#" className="px-6 py-2 rounded-full text-slate-400 hover:text-white font-bold transition-all">
                                Analytics
                            </Link>
                            <Link href="#" className="px-6 py-2 rounded-full text-slate-400 hover:text-white font-bold transition-all">
                                Settings
                            </Link>
                        </nav>

                        <div className="flex items-center gap-6">
                            <MobileNav items={navItems} />
                            <div className="hidden sm:block text-right">
                                <p className="text-white font-bold text-sm leading-none">{session.user?.email}</p>
                                <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest mt-1.5">
                                    {session.user?.email?.includes('admin') ? 'Administrator' : 'Verified Member'}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-emerald-400 font-black shadow-inner">
                                {session.user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <form action={logoutAction}>
                                <Button variant="ghost" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full px-6 transition-all font-bold">
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
