"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Store } from "lucide-react";

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    department: string;
    level: string;
    sellerStatus: string;
}

export default function AdminSellersPage() {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch("/api/admin/sellers");
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to fetch applications");
            setPendingUsers(data.users);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId: string, action: 'approve' | 'reject') => {
        try {
            const response = await fetch("/api/admin/sellers", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || `Failed to ${action} user`);

            toast.success(data.message || `User ${action}d successfully`);
            fetchApplications();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Seller Applications</h1>
                    <p className="text-slate-500 mt-1 text-sm">Review and authorize new sellers on the platform.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="glass border-white/[0.04]">
                            <CardHeader>
                                <Skeleton className="h-6 w-40 bg-white/[0.04]" />
                                <Skeleton className="h-4 w-60 mt-2 bg-white/[0.04]" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full bg-white/[0.04]" />
                                <Skeleton className="h-4 w-2/3 bg-white/[0.04]" />
                                <Skeleton className="h-10 w-full rounded-xl bg-white/[0.04]" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-xl text-sm font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Seller <span className="text-gradient">Applications</span>
                </h1>
                <p className="text-slate-600 text-sm font-medium tracking-wide mt-1">Review and authorize new sellers on the platform.</p>
            </div>

            {pendingUsers.length === 0 ? (
                <div className="glass p-20 rounded-[2rem] border-white/[0.04] text-center">
                    <div className="w-16 h-16 bg-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
                        <Store className="w-8 h-8 text-amber-400/60" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">All Caught Up!</h3>
                    <p className="text-slate-600 font-light">No pending applications at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {pendingUsers.map(user => (
                        <Card key={user._id} className="glass border-white/[0.04] shadow-xl hover:translate-y-[-2px] transition-all duration-300 rounded-[1.5rem] overflow-hidden">
                            <div className="h-0.5 bg-gradient-to-r from-amber-500/40 via-amber-400/60 to-amber-500/40 w-full" />
                            <CardHeader>
                                <CardTitle className="text-lg text-white font-bold tracking-tight">
                                    {user.firstName} {user.lastName}
                                </CardTitle>
                                <p className="text-sm text-amber-300/60 font-medium">{user.email}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 text-sm gap-2 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                                    <div className="text-slate-600 font-medium">Department:</div>
                                    <div className="font-semibold text-white">{user.department}</div>
                                    <div className="text-slate-600 font-medium">Level:</div>
                                    <div className="font-semibold text-white">{user.level}</div>
                                </div>
                                <div className="flex gap-3 pt-1">
                                    <Button
                                        onClick={() => handleAction(user._id, 'approve')}
                                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-5 text-sm font-bold"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1.5" />
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleAction(user._id, 'reject')}
                                        variant="outline"
                                        className="flex-1 border-white/[0.06] text-slate-400 hover:bg-rose-500/5 hover:text-rose-400 rounded-xl py-5 text-sm font-medium"
                                    >
                                        <XCircle className="w-4 h-4 mr-1.5" />
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
