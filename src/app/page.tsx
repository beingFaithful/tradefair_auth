import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
    const session = await auth();

    if (session) {
        redirect("/buyer");
    }

    return (
        <div className="min-h-screen bg-cinema text-foreground overflow-hidden">
            {/* Strip across top */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-white/[0.03]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/10">
                                <span className="text-white font-black text-2xl tracking-tighter">T</span>
                            </div>
                            <span className="text-xl font-bold text-white/90 tracking-widest uppercase">Tradefair</span>
                        </div>
                        <div className="hidden md:flex items-center gap-10">
                            <Link href="#features" className="text-slate-500 hover:text-amber-300 text-sm font-medium tracking-wider uppercase transition-colors">Features</Link>
                            <Link href="#how-it-works" className="text-slate-500 hover:text-amber-300 text-sm font-medium tracking-wider uppercase transition-colors">How it Works</Link>
                            <div className="h-4 w-px bg-white/5"></div>
                            <Link href="/login" className="text-slate-400 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors">Sign In</Link>
                            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 py-5 shadow-xl shadow-amber-500/10 text-sm font-bold tracking-wider uppercase">
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero - Cinematic */}
            <section className="relative min-h-[90vh] flex items-center justify-center red-carpet">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-amber-500/3 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
                    <div className="text-center space-y-10 max-w-5xl mx-auto">
                        <div className="space-y-2">
                            <p className="text-amber-400/60 text-xs font-bold tracking-[0.3em] uppercase">The Campus Marketplace</p>
                            <div className="w-12 h-px bg-amber-500/30 mx-auto" />
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter">
                            Trade with
                            <br />
                            <span className="text-gradient">Confidence</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
                            The premium marketplace crafted for MTU students.
                            <br />
                            <span className="text-slate-600">Secure, exclusive, extraordinary.</span>
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                            <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-full px-12 py-7 text-base font-bold tracking-wider uppercase shadow-2xl shadow-amber-500/20 w-full sm:w-auto transition-all duration-300 hover:shadow-amber-500/30 hover:scale-[1.02]">
                                <Link href="/signup">Join the Experience</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-white/[0.06] bg-white/[0.02] text-slate-300 rounded-full px-12 py-7 text-base font-medium tracking-wider hover:bg-white/[0.05] hover:text-white hover:border-white/10 backdrop-blur-sm w-full sm:w-auto transition-all duration-300">
                                <Link href="/buyer">Browse Marketplace</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features - Luxe Cards */}
            <section id="features" className="py-40 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24 space-y-4">
                        <p className="text-amber-400/60 text-xs font-bold tracking-[0.3em] uppercase">The Experience</p>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                            Crafted for <span className="text-gradient">Excellence</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                number: "01",
                                title: "Verified Community",
                                desc: "Exclusively for MTU students and authenticated alumni. A trusted network you can rely on.",
                            },
                            {
                                number: "02",
                                title: "Live Conversations",
                                desc: "Connect directly with sellers. Negotiate, ask questions, and coordinate seamlessly.",
                            },
                            {
                                number: "03",
                                title: "Secure Transactions",
                                desc: "Mock payment flow via Paystack for a professional, risk-free experience.",
                            },
                        ].map((f) => (
                            <div key={f.number} className="group relative">
                                <div className="absolute -inset-px bg-gradient-to-b from-amber-500/10 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative glass rounded-[2rem] p-10 space-y-6 h-full transition-all duration-500 hover:translate-y-[-4px]">
                                    <span className="text-5xl font-black text-amber-500/10 group-hover:text-amber-500/20 transition-colors duration-500">{f.number}</span>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">{f.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-light">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />
            </div>

            {/* Footer */}
            <footer className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-700 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/10">
                            <span className="text-white font-black text-lg">T</span>
                        </div>
                        <span className="text-sm font-bold text-white/60 tracking-widest uppercase">Tradefair</span>
                    </div>
                    <p className="text-slate-600 text-xs font-medium tracking-[0.2em] uppercase">
                        &copy; 2024 Tradefair &middot; Built for MTU
                    </p>
                </div>
            </footer>
        </div>
    );
}
