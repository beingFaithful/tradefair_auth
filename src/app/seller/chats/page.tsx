"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatSkeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function SellerChatsPage() {
    const searchParams = useSearchParams();
    const initialRoomId = searchParams.get('roomId');

    const [rooms, setRooms] = useState<any[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(initialRoomId);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch("/api/chat/rooms");
                const data = await res.json();
                if (data.rooms) {
                    setRooms(data.rooms);
                    if (!activeRoomId && data.rooms.length > 0) {
                        setActiveRoomId(data.rooms[0]._id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch rooms", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        if (!activeRoomId) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat?roomId=${activeRoomId}`);
                const data = await res.json();
                if (data.messages) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [activeRoomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeRoomId) return;

        const text = newMessage;
        setNewMessage("");
        setMessages(prev => [...prev, {
            _id: Date.now().toString(),
            text,
            senderId: "me",
            createdAt: new Date().toISOString()
        }]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId: activeRoomId, text })
            });
            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Failed to send message");
            }
        } catch {
            toast.error("Failed to send message");
        }
    };

    if (isLoading) return <ChatSkeleton />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
            <Card className="col-span-1 glass border-white/5 rounded-[2rem] overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-4 sticky top-0 bg-background/95 backdrop-blur-xl">
                    <CardTitle className="text-lg text-white font-bold">Customer Messages</CardTitle>
                </CardHeader>
                <div className="divide-y divide-white/5 overflow-y-auto">
                    {rooms.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 font-medium">No chats yet.</div>
                    ) : (
                        rooms.map(room => (
                            <div
                                key={room._id}
                                onClick={() => setActiveRoomId(room._id)}
                                className={`p-5 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                                    activeRoomId === room._id
                                        ? 'bg-emerald-500/5 border-l-4 border-emerald-500'
                                        : 'border-l-4 border-transparent'
                                }`}
                            >
                                <p className="font-bold text-white truncate">
                                    {room.productId?.title || 'General Inquiry'}
                                </p>
                                <p className="text-sm text-slate-500 truncate mt-1.5 font-medium">
                                    Buyer: {room.buyerId?.email}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Card className="col-span-1 md:col-span-2 glass border-white/5 rounded-[2rem] flex flex-col overflow-hidden">
                {!activeRoomId ? (
                    <div className="flex-grow flex items-center justify-center text-slate-500 font-medium">
                        Select a conversation to start messaging.
                    </div>
                ) : (
                    <>
                        <CardHeader className="border-b border-white/5 pb-4 bg-background/95 backdrop-blur-xl">
                            <CardTitle className="text-lg text-white font-bold">
                                {rooms.find(r => r._id === activeRoomId)?.productId?.title || 'Chat'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow p-5 overflow-y-auto space-y-4">
                            {messages.map((msg, i) => {
                                const isMe = msg.senderId === "me" || msg.senderId === rooms.find(r => r._id === activeRoomId)?.sellerId;
                                return (
                                    <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] space-y-1`}>
                                            <div className={`rounded-2xl px-4 py-2.5 ${
                                                isMe
                                                    ? 'bg-emerald-600 text-white rounded-br-none'
                                                    : 'bg-white/[0.05] text-slate-100 rounded-bl-none border border-white/5'
                                            }`}>
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                            </div>
                                            {msg.createdAt && (
                                                <p className={`text-[10px] text-slate-600 font-medium px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </CardContent>
                        <div className="p-4 border-t border-white/5 bg-background/50">
                            <form onSubmit={sendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-grow rounded-2xl border border-white/10 bg-white/[0.03] text-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 placeholder:text-slate-600 transition-all"
                                />
                                <Button type="submit" className="rounded-2xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/10">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}
