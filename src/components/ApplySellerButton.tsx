"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ApplySellerButton() {
    const [loading, setLoading] = useState(false);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/seller/apply', { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || 'Application submitted!');
                window.location.reload();
            } else {
                toast.error(data.error || 'Failed to submit application');
            }
        } catch {
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleApply}>
            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full py-6"
            >
                {loading ? 'Submitting...' : 'Apply to be a Seller'}
            </Button>
        </form>
    );
}
