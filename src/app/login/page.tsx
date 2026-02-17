"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/";
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            router.push(next);
        } else {
            alert(data.error || "Login failed");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Login</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="border p-3 rounded"
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="border p-3 rounded"
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    className="bg-[#5e17eb] text-white py-3 rounded hover:bg-[#4b12c2]"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="mt-4 text-sm">
                Don’t have an account?{" "}
                <Link href="/register" className="text-[#5e17eb] underline">
                    Register
                </Link>
            </p>
        </div>
    );
}
