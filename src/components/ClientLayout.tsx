"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    return (
        <>
            {!isAdmin && <Navbar />}
            <main
                className={`min-h-screen ${
                    isAdmin
                        ? "bg-gray-50"
                        : "bg-gradient-to-b from-[#5f18eb15] via-transparent to-[#5f18eb08]"
                }`}
            >
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}
