"use client";

import { useEffect, useState } from "react";

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

        // Show an alert with the product name that was deleted
        const deletedProduct = products.find((p) => p._id === id);
        if (deletedProduct) {
            alert(`Deleted product: ${deletedProduct.name}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Products</h1>

            {/* ➕ Add Product */}
            <div className="border p-4 mb-6 rounded">
                <h2 className="font-semibold mb-3">Add Product</h2>

                {["name", "price", "description"].map((f) => (
                    <input
                        key={f}
                        placeholder={f}
                        value={(form as any)[f]}
                        onChange={(e) =>
                            setForm({ ...form, [f]: e.target.value })
                        }
                        className="border p-2 mb-2 w-full rounded"
                    />
                ))}

                <input
                    type="file"
                    onChange={(e: any) =>
                        setForm({ ...form, file: e.target.files[0] })
                    }
                    className="border p-2 mb-2 w-full rounded"
                />

                <button
                    onClick={createProduct}
                    className="bg-[#5e17eb] text-white px-4 py-2 rounded"
                >
                    Create
                </button>
            </div>

            {/* Products List */}
            {products.map((p) => (
                <div
                    key={p._id}
                    className="flex gap-4 items-center border p-3 mb-3 rounded"
                >
                    <img src={p.image} className="w-20 h-20 object-cover" />

                    <div className="flex-1">
                        <p className="font-semibold">{p.name}</p>
                        <p>₹{p.price}</p>
                    </div>

                    <button
                        onClick={() => deleteProduct(p._id)}
                        className="text-red-500 cursor-pointer hover:bg-red-500 hover:text-white px-2.5 py-1 rounded-xl"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
