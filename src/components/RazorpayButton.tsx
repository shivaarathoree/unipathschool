"use client";

import { useState } from "react";
import IconifyIcon from "./IconifyIcon";

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

interface RazorpayButtonProps {
    amount: number; // in INR
    onSuccess?: (response: any) => void;
    title?: string;
    description?: string;
    buttonText?: string;
    className?: string; // Add custom styling
}

export default function RazorpayButton({
    amount,
    onSuccess,
    title = "Premium Access",
    description = "Unlock premium company questions",
    buttonText = "Pay Now",
    className = "bg-primary hover:bg-primary-dark text-white rounded-xl px-8 py-3 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
}: RazorpayButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);
        const res = await loadRazorpayScript();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            setIsLoading(false);
            return;
        }

        try {
            // Create a new order via our API route
            const orderRes = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const order = await orderRes.json();

            if (order.error) {
                alert(order.error);
                setIsLoading(false);
                return;
            }

            // Define Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: order.amount, // in paise
                currency: order.currency,
                name: "UniPath School",
                description: description,
                order_id: order.id,
                handler: function (response: any) {
                    if (onSuccess) {
                        onSuccess(response);
                    } else {
                        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                    }
                },
                prefill: {
                    name: "Student",
                    email: "student@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#C2410C" // Primary color from globals.css
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.on("payment.failed", function (response: any) {
                alert("Payment failed: " + response.error.description);
            });
            paymentObject.open();
        } catch (error) {
            console.error("Payment Initiation Failed:", error);
            alert("Could not initialize payment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={isLoading}
            className={className}
        >
            {isLoading ? (
                <IconifyIcon icon="svg-spinners:270-ring" className="text-xl" />
            ) : (
                <>
                    <IconifyIcon icon="solar:wallet-bold-duotone" className="text-xl" />
                    {buttonText} (₹{amount})
                </>
            )}
        </button>
    );
}
