import { NextResponse } from "next/server";
import connectDb from "db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json({ error: "No reference supplied" }, { status: 400 });
        }

        await connectDb();

        const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        if (!paystackRes.ok) {
            console.error("Failed to verify transaction with Paystack");
            return NextResponse.redirect(new URL('/buyer/orders', req.url));
        }

        const paystackData = await paystackRes.json();

        if (paystackData.data.status === "success") {
            // Find the order
            const order = await Order.findOne({ paystackReference: reference });

            if (order) {
                // Update Order status
                order.status = 'paid';
                await order.save();

                // Update Product status
                const product = await Product.findById(order.product);
                if (product) {
                    product.status = 'sold';
                    await product.save();
                }
                
                return NextResponse.redirect(new URL(`/payment/success?reference=${reference}`, req.url));
            } else {
                return NextResponse.json({ error: "Order not found for this reference" }, { status: 404 });
            }
        } else {
            // Payment failed or abandoned
            return NextResponse.redirect(new URL('/buyer/orders', req.url));
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
