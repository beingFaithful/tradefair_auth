"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MessageSellerButton({ productId }: { productId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const startChat = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/chat/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            });

            const data = await res.json();

            if (res.ok && data.room) {
                router.push(`/buyer/chats?roomId=${data.room._id}`);
            } else {
                toast.error(data.error || "Failed to start chat");
            }
        } catch {
            toast.error("Error starting chat");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="w-full border-white/10 text-slate-300 hover:bg-white/[0.05] rounded-xl"
            onClick={startChat}
            disabled={isLoading}
        >
            {isLoading ? "Starting chat..." : "Message"}
        </Button>
    );
}
