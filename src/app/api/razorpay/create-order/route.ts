import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { razorpayOrderSchema } from "@/lib/validations";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const parsed = razorpayOrderSchema.safeParse(body);
        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0]?.message ?? "Invalid amount";
            return NextResponse.json(
                { error: firstIssue },
                { status: 400 }
            );
        }

        const { amount } = parsed.data;

        // Ensure keys are set
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { error: "Razorpay keys missing from environment. Please add them to .env" },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Razorpay accepts amount in paise (1 INR = 100 paise)
        const options = {
            amount: (amount * 100).toString(),
            currency: "INR",
            receipt: "receipt_order_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Razorpay Order Creation Failed:", msg);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
