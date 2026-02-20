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

const LABELS: Record<string, string> = {
    name: "Full Name",
    phone: "Phone",
    address: "Street Address",
    city: "City",
    state: "State",
    pincode: "Pincode",
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
    const router = useRouter();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
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

        if (!loaded) return alert("Razorpay SDK failed to load");

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
                ...response,
                amount: totalAmount,
                shippingAddress: address
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

    if (loading)
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="loading-spinner" />
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-10 flex items-center gap-3">
                <span className="w-2 h-10 bg-gradient-to-b from-[var(--primary)] to-[var(--primary-light)] rounded-full" />
                <span className="gradient-text">Checkout</span>
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-6 text-[var(--foreground)] flex items-center gap-2">
                        <span className="w-1 h-6 bg-[var(--primary)] rounded-full" />
                        Shipping Address
                    </h2>

                    {Object.keys(address).map((key) => (
                        <input
                            key={key}
                            placeholder={LABELS[key as keyof typeof LABELS] || key}
                            className="input-field mb-4"
                            value={address[key as keyof typeof address]}
                            onChange={(e) =>
                                setAddress({
                                    ...address,
                                    [key]: e.target.value,
                                })
                            }
                        />
                    ))}
                </div>

                <div className="card p-6 h-fit glow">
                    <h2 className="text-xl font-bold mb-6 text-[var(--foreground)] flex items-center gap-2">
                        <span className="w-1 h-6 bg-[var(--primary)] rounded-full" />
                        Order Summary
                    </h2>

                    {cart.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between mb-3 text-sm py-2 border-b border-[var(--border)]"
                        >
                            <span className="text-[var(--muted-foreground)]">
                                {item.product.name} x{item.quantity}
                            </span>
                            <span className="font-medium text-[var(--foreground)]">
                                ₹{item.product.price * item.quantity}
                            </span>
                        </div>
                    ))}

                    <hr className="my-4 border-[var(--border)]" />

                    <p className="font-bold text-2xl mb-6 text-[var(--foreground)]">
                        Total: ₹{totalAmount}
                    </p>

                    <button
                        onClick={handleCheckout}
                        className="btn-primary w-full text-lg py-4"
                    >
                        Pay Now →
                    </button>
                </div>
            </div>
        </div>
    );
}
