import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/models/User";
import connectDb from "db";

// GET all pending seller applications
export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const admin = await User.findOne({ email: session.user.email });

        if (!admin || !admin.role.includes('admin')) {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const pendingSellers = await User.find({ sellerStatus: 'pending' }).select("-password");

        return NextResponse.json({ users: pendingSellers });

    } catch (error) {
        console.error("Admin Fetch Sellers Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH to approve or reject a seller
export async function PATCH(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const admin = await User.findOne({ email: session.user.email });

        if (!admin || !admin.role.includes('admin')) {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const { userId, action } = await req.json(); // action: 'approve' or 'reject'

        if (!userId || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (action === 'approve') {
            user.sellerStatus = 'approved';
            if (!user.role.includes('seller')) {
                user.role.push('seller');
            }
        } else if (action === 'reject') {
            user.sellerStatus = 'rejected';
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        await user.save();

        return NextResponse.json({
            message: `Seller application ${action}d successfully.`,
            user: {
                id: user._id,
                email: user.email,
                sellerStatus: user.sellerStatus,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Admin Update Seller Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
