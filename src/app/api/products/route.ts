import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import Product from "@/models/Product";
import User from "@/models/User";
import connectDb from "db";
import { resolveUserEmail } from "@/lib/api-auth";

export async function GET(req: Request) {
    try {
        await connectDb();
        
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status') || 'available';

        // Buyers and public can see available products
        const products = await Product.find({ status })
            .populate('seller', 'email') // Populate seller basic info
            .limit(limit)
            .sort({ createdAt: -1 });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Fetch Products API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userEmail = await resolveUserEmail(req);

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const user = await User.findOne({ email: userEmail });

        if (!user || !user.isAuthorizedSeller) {
            return NextResponse.json({ error: "Forbidden: Only authorized sellers can list products." }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, price, condition, images } = body;

        if (!title || !description || !price || !condition) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newProduct = await Product.create({
            title,
            description,
            price: Number(price),
            condition,
            seller: user._id,
            images: images || [],
            status: 'available'
        });

        return NextResponse.json({
            message: "Product listed successfully",
            product: newProduct
        }, { status: 201 });

    } catch (error) {
        console.error("Create Product API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
