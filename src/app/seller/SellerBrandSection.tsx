"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

export function SellerBrandSection({
    sellerName,
    updateAction,
}: {
    sellerName?: string;
    updateAction: (formData: FormData) => void;
}) {
    const [editing, setEditing] = useState(false);

    return (
        <Card className="glass border-white/5 shadow-xl rounded-[2rem] overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-700 w-full" />
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                        <Store className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-white">Your Brand</CardTitle>
                        <p className="text-slate-400 text-sm font-medium mt-0.5">
                            {sellerName
                                ? `Selling as "${sellerName}"`
                                : "Set a custom seller name for your brand"}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-2">
                {editing ? (
                    <form action={updateAction} className="flex gap-3 items-end" onSubmit={() => setTimeout(() => setEditing(false), 100)}>
                        <div className="flex-1 space-y-1.5">
                            <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-1">
                                Seller / Brand Name
                            </label>
                            <input
                                name="sellerName"
                                defaultValue={sellerName || ""}
                                placeholder="e.g. GadgetZone MTU"
                                className="w-full py-3 px-5 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300"
                            />
                        </div>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3 font-bold">
                            Save
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setEditing(false)} className="text-slate-400 hover:text-white rounded-xl px-4 py-3 font-bold">
                            Cancel
                        </Button>
                    </form>
                ) : (
                    <Button
                        variant="outline"
                        onClick={() => setEditing(true)}
                        className="border-white/10 text-slate-300 hover:bg-white/[0.05] rounded-xl font-bold"
                    >
                        {sellerName ? "Edit Brand Name" : "Set Brand Name"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
