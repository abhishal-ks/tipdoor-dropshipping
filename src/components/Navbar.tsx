"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-b bg-white">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
                <Link href="/" className="font-bold text-xl text-[#5e17eb]">
                    TipDoor
                </Link>

                <div className="flex gap-6">
                    <Link href="/cart">Cart</Link>
                    <Link href="/checkout">Checkout</Link>
                </div>
            </div>
        </nav>
    );
}
