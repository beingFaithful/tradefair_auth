import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/models/User";
import connectDb from "db";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.sellerStatus === 'pending') {
            return NextResponse.json({ message: "Your application is already pending review." }, { status: 400 });
        }

        if (user.sellerStatus === 'approved' || user.role.includes('seller')) {
            return NextResponse.json({ message: "You are already an authorized seller" }, { status: 400 });
        }

        user.sellerStatus = 'pending';
        await user.save();

        return NextResponse.json({
            message: "Seller application submitted successfully. An admin will review your request.",
            status: user.sellerStatus
        });

    } catch (error) {
        console.error("Seller Apply API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
