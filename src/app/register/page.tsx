"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/";
    const [form, setForm] = useState({
        name: "",
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

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            router.push(next);
        } else {
            alert(data.error || "Registration failed");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create Account</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    name="name"
                    placeholder="Name"
                    className="border p-3 rounded"
                    onChange={handleChange}
                    required
                />
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
                    {loading ? "Creating..." : "Register"}
                </button>
            </form>

            <p className="mt-4 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-[#5e17eb] underline">
                    Login
                </Link>
            </p>
        </div>
    );
}
