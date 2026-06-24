import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import Product from "@/models/Product";
import User from "@/models/User";
import connectDb from "db";

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const user = await User.findOne({ email: session.user.email });

        if (!user || !user.isAuthorizedSeller) {
            return NextResponse.json({ error: "Forbidden: Only authorized sellers can view their dashboard listings." }, { status: 403 });
        }

        // Fetch all products by this specific seller, regardless of status (available, sold, hidden)
        const products = await Product.find({ seller: user._id })
            .sort({ createdAt: -1 });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Seller Fetch Products API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
