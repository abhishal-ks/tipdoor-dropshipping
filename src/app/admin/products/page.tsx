"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [form, setForm] = useState<{
        name: string;
        price: string;
        description: string;
        image: string;
        file: File | null;
    }>({
        name: "",
        price: "",
        image: "",
        description: "",
        file: null,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/admin/products", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setProducts(data);
    };

    const createProduct = async () => {
        const token = localStorage.getItem("token");

        const fd = new FormData();

        if (!form.file) return alert("Please select image");
        fd.append("file", form.file);

        const uploadRes = await fetch("/api/admin/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
        });

        const upload = await uploadRes.json();

        await fetch("/api/admin/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: form.name,
                price: Number(form.price),
                description: form.description,
                image: upload.url,
            }),
        });

        setForm({
            name: "",
            price: "",
            image: "",
            description: "",
            file: null,
        });

        fetchProducts();
    };

    const deleteProduct = async (id: string) => {
        const token = localStorage.getItem("token");

        await fetch(`/api/admin/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        fetchProducts();

        const deletedProduct = products.find((p) => p._id === id);
        if (deletedProduct) {
            alert(`Deleted product: ${deletedProduct.name}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="text-[var(--primary)] font-medium hover:underline"
                    >
                        ← Dashboard
                    </Link>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin Products
                    </h1>
                </div>
            </header>

            {/* Add Product */}
            <div className="card p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                    Add Product
                </h2>

                {["name", "price", "description"].map((f) => (
                    <input
                        key={f}
                        placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                        value={(form as any)[f]}
                        onChange={(e) =>
                            setForm({ ...form, [f]: e.target.value })
                        }
                        className="input-field mb-4"
                    />
                ))}

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e: any) =>
                        setForm({ ...form, file: e.target.files[0] })
                    }
                    className="input-field mb-4"
                />

                <button onClick={createProduct} className="btn-primary">
                    Create
                </button>
            </div>

            {/* Products List */}
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Products
            </h2>
            {products.map((p) => (
                <div
                    key={p._id}
                    className="card flex gap-4 items-center p-4 mb-4"
                >
                    <img
                        src={p.image}
                        alt={p.name}
                        className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <p className="text-[var(--primary)] font-medium">
                            ₹{p.price}
                        </p>
                    </div>

                    <button
                        onClick={() => deleteProduct(p._id)}
                        className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
