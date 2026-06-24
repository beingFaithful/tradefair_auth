import { NextResponse } from "next/server";
import connectDb from "db";
import ChatRoom from "@/models/ChatRoom";
import User from "@/models/User";
import Product from "@/models/Product";
import { resolveUserEmail } from "@/lib/api-auth";

// GET all chat rooms for the logged-in user
export async function GET(req: Request) {
    try {
        const userEmail = await resolveUserEmail(req);

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const user = await User.findOne({ email: userEmail });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Find rooms where user is buyer or seller
        const rooms = await ChatRoom.find({
            $or: [{ buyerId: user._id }, { sellerId: user._id }]
        })
        .populate('buyerId', 'email')
        .populate('sellerId', 'email')
        .populate('productId', 'title')
        .sort({ lastMessageAt: -1 });

        return NextResponse.json({ rooms });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch chat rooms" }, { status: 500 });
    }
}

// POST to create or get an existing chat room for a product
export async function POST(req: Request) {
    try {
        const userEmail = await resolveUserEmail(req);

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        await connectDb();
        const user = await User.findOne({ email: userEmail });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const product = await Product.findById(productId);
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        // Don't allow seller to chat with themselves
        if (product.seller.toString() === user._id.toString()) {
            return NextResponse.json({ error: "You cannot chat with yourself" }, { status: 400 });
        }

        // Check if room already exists
        let room = await ChatRoom.findOne({
            buyerId: user._id,
            sellerId: product.seller,
            productId: product._id
        });

        if (!room) {
            room = await ChatRoom.create({
                buyerId: user._id,
                sellerId: product.seller,
                productId: product._id
            });
        }

        return NextResponse.json({ room });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create chat room" }, { status: 500 });
    }
}
