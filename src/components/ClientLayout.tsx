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
                className={`min-h-screen transition-colors duration-300 ${
                    isAdmin
                        ? "bg-gray-50 dark:bg-[var(--background)]"
                        : "bg-gradient-to-b from-[#5f18eb08] via-transparent to-[#5f18eb15] dark:from-[#5f18eb15] dark:via-transparent dark:to-[#5f18eb08]"
                }`}
            >
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}
