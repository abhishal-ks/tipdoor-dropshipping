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
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
                <span className="w-1 h-8 bg-[var(--primary)] rounded-full" />
                Checkout
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">
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

                <div className="card p-6 h-fit">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">
                        Order Summary
                    </h2>

                    {cart.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between mb-3 text-sm"
                        >
                            <span className="text-gray-700">
                                {item.product.name} x{item.quantity}
                            </span>
                            <span className="font-medium">
                                ₹{item.product.price * item.quantity}
                            </span>
                        </div>
                    ))}

                    <hr className="my-4 border-gray-200" />

                    <p className="font-bold text-lg mb-6">
                        Total: ₹{totalAmount}
                    </p>

                    <button
                        onClick={handleCheckout}
                        className="btn-primary w-full"
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
}
