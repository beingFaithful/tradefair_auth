"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BuyButton({ productId }: { productId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleBuy = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            });

            const data = await res.json();

            if (res.ok) {
                if (data.authorizationUrl) {
                    toast.success("Redirecting to payment...");
                    window.location.href = data.authorizationUrl;
                } else {
                    toast.error("Order created, but no payment URL received.");
                }
            } else {
                toast.error(data.error || "Failed to create order");
            }
        } catch {
            toast.error("Error creating order");
        } finally {
            setIsLoading(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                onClick={() => setShowConfirm(true)}
                disabled={isLoading}
            >
                {isLoading ? "Processing..." : "Buy Now"}
            </Button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
                    <div className="glass-dark rounded-[2rem] p-8 max-w-sm w-full mx-4 border-emerald-500/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-white mb-2">Confirm Purchase</h3>
                        <p className="text-slate-400 mb-6">Are you sure you want to buy this item? You will be redirected to complete payment.</p>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 border-white/5 text-slate-300 hover:bg-white/[0.05] rounded-xl" onClick={() => setShowConfirm(false)}>
                                Cancel
                            </Button>
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" onClick={handleBuy} disabled={isLoading}>
                                {isLoading ? "Redirecting..." : "Confirm & Pay"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
