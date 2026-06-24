import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import connectDb from "db";
import { resolveUserEmail } from "@/lib/api-auth";

export async function POST(req: Request) {
    try {
        const userEmail = await resolveUserEmail(req);

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.status !== 'available') {
            return NextResponse.json({ error: "Product is no longer available" }, { status: 400 });
        }

        if (product.seller.toString() === user._id.toString()) {
            return NextResponse.json({ error: "You cannot buy your own product" }, { status: 400 });
        }

        // PAYSTACK INTEGRATION
        const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                amount: Math.round(product.price * 100), // Paystack uses kobo/pesewas
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`,
            })
        });

        if (!paystackRes.ok) {
            const errorData = await paystackRes.json();
            console.error("Paystack Error:", errorData);
            return NextResponse.json({ error: "Payment gateway initialization failed" }, { status: 502 });
        }

        const paystackData = await paystackRes.json();
        const reference = paystackData.data.reference;
        const authUrl = paystackData.data.authorization_url;

        const newOrder = await Order.create({
            buyer: user._id,
            seller: product.seller,
            product: product._id,
            amount: product.price,
            status: 'pending',
            paystackReference: reference
        });

        // Reserve the product temporarily
        product.status = 'hidden'; 
        await product.save();

        return NextResponse.json({
            message: "Order created successfully. Proceed to payment.",
            order: newOrder,
            authorizationUrl: authUrl
        }, { status: 201 });

    } catch (error) {
        console.error("Create Order API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
