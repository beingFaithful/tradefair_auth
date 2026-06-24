import { NextResponse } from "next/server";
import connectDb from "db";
import ChatRoom from "@/models/ChatRoom";
import User from "@/models/User";
import { resolveUserEmail } from "@/lib/api-auth";

export async function POST(req: Request) {
    try {
        const userEmail = await resolveUserEmail(req);

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { sellerId } = await req.json();

        if (!sellerId) {
            return NextResponse.json({ error: "Seller ID is required" }, { status: 400 });
        }

        await connectDb();
        const user = await User.findOne({ email: userEmail });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const seller = await User.findById(sellerId);
        if (!seller) return NextResponse.json({ error: "Seller not found" }, { status: 404 });

        // Don't allow chatting with yourself
        if (seller._id.toString() === user._id.toString()) {
            return NextResponse.json({ error: "You cannot chat with yourself" }, { status: 400 });
        }

        // Check if room already exists between these two users (without productId)
        let room = await ChatRoom.findOne({
            buyerId: user._id,
            sellerId: seller._id,
            productId: { $exists: false }
        });

        if (!room) {
            room = await ChatRoom.create({
                buyerId: user._id,
                sellerId: seller._id
            });
        }

        return NextResponse.json({ room });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create chat room" }, { status: 500 });
    }
}
