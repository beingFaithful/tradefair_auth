"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

export function ChatSellerButton({ sellerId }: { sellerId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const startChat = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/chat/rooms/seller", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sellerId })
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 shadow-xl shadow-emerald-500/10 font-bold"
            onClick={startChat}
            disabled={isLoading}
        >
            <MessageCircle className="w-5 h-5 mr-2" />
            {isLoading ? "Starting chat..." : "Chat with Seller"}
        </Button>
    );
}
