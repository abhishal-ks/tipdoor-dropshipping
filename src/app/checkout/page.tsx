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

        // 📝 Create order
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
                // razorpay_order_id: response.razorpay_order_id,
                // razorpay_payment_id: response.razorpay_payment_id,
                // razorpay_signature: response.razorpay_signature,
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

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

                {Object.keys(address).map((key) => (
                    <input
                        key={key}
                        placeholder={key}
                        className="border p-3 mb-3 w-full rounded"
                        onChange={(e) =>
                            setAddress({ ...address, [key]: e.target.value })
                        }
                    />
                ))}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {cart.map((item) => (
                    <div key={item._id} className="flex justify-between mb-2">
                        <span>{item.product.name}</span>
                        <span>₹{item.product.price * item.quantity}</span>
                    </div>
                ))}

                <hr className="my-3" />

                <p className="font-bold mb-4">Total: ₹{totalAmount}</p>

                <button
                    onClick={handleCheckout}
                    className="bg-[#5e17eb] text-white px-6 py-3 rounded"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
}
