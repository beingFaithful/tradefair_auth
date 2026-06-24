import { NextResponse } from "next/server";
import connectDb from "db";
import ChatRoom from "@/models/ChatRoom";
import Message from "@/models/Message";
import User from "@/models/User";
import { resolveUserEmail } from "@/lib/api-auth";

// GET messages for a specific room
export async function GET(req: Request) {
    try {
        const userEmail = await resolveUserEmail(req);

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const roomId = searchParams.get('roomId');

        if (!roomId) {
            return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
        }

        await connectDb();
        const user = await User.findOne({ email: userEmail });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Verify user is part of the room
        const room = await ChatRoom.findById(roomId);
        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
        
        if (room.buyerId.toString() !== user._id.toString() && room.sellerId.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "Unauthorized access to this room" }, { status: 403 });
        }

        const messages = await Message.find({ chatRoomId: roomId }).sort({ createdAt: 1 });
        
        return NextResponse.json({ messages });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

// POST a new message
export async function POST(req: Request) {
    try {
        const userEmail = await resolveUserEmail(req);

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { roomId, text } = await req.json();

        if (!roomId || !text) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDb();
        const user = await User.findOne({ email: userEmail });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Verify user is part of the room
        const room = await ChatRoom.findById(roomId);
        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
        
        if (room.buyerId.toString() !== user._id.toString() && room.sellerId.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "Unauthorized access to this room" }, { status: 403 });
        }

        const message = await Message.create({
            chatRoomId: roomId,
            senderId: user._id,
            text
        });

        // Update lastMessageAt for the room
        await ChatRoom.findByIdAndUpdate(roomId, { lastMessageAt: new Date() });

        return NextResponse.json({ message });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
