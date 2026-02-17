"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
    _id: string;
    quantity: number;
    product: {
        name: string;
        price: number;
        image: string;
    };
};

const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/cart", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (data.error === "Unauthorized") {
            router.push("/login");
        }

        if (Array.isArray(data)) {
            setCart(data);
        } else {
            setCart([]);
        }

        setLoading(false);
    };

    const totalAmount = Array.isArray(cart)
        ? cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        )
        : 0;

    const handleCheckout = async () => {
        const token = localStorage.getItem("token");

        const loaded = await loadRazorpay();

        if (!loaded) {
            alert("Razorpay SDK failed to load");
            return;
        }

        // Create order
        const orderRes = await fetch("/api/payment/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: totalAmount }),
        });

        const order = await orderRes.json();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
            name: "TipDoor",
            description: "Checkout",
            order_id: order.id,

            handler: async function (response: any) {
                await verifyPayment(response);
            },

            theme: {
                color: "#5e17eb",
            },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    };

    const verifyPayment = async (response: any) => {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: totalAmount,
            }),
        });

        const data = await res.json();

        if (data.success) {
            alert("Payment successful!");
            router.push("/orders");
        } else {
            alert("Payment verification failed");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {cart.map((item) => (
                <div
                    key={item._id}
                    className="flex items-center gap-4 border-b py-4"
                >
                    <img
                        src={item.product.image}
                        className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                        </p>
                    </div>
                    <p>₹{item.product.price * item.quantity}</p>
                </div>
            ))}

            <div className="mt-6 flex justify-between items-center">
                <h2 className="text-xl font-bold">Total: ₹{totalAmount}</h2>

                <button
                    onClick={handleCheckout}
                    className="bg-[#5e17eb] text-white px-6 py-3 rounded hover:bg-[#4b12c2]"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
}
