import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-20 bg-gradient-to-b from-[var(--primary-muted)]/30 to-[var(--primary-muted)]/10 dark:from-[var(--primary-muted)]/20 dark:to-transparent border-t border-[var(--border)] backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 mb-3"
                        >
                            {/* Logo Image - Place your logo at public/logo.png or public/logo.svg */}
                            <img
                                src="/logo.png"
                                alt="TipDoor Logo"
                                className="h-12 md:h-14 w-auto"
                                onError={(e) => {
                                    // Fallback to text if logo not found
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    const parent = target.parentElement;
                                    if (parent && !parent.querySelector(".logo-text")) {
                                        const text = document.createElement("span");
                                        text.className = "logo-text text-2xl font-bold gradient-text";
                                        text.textContent = "TipDoor";
                                        parent.appendChild(text);
                                    }
                                }}
                            />
                            <span className="text-2xl font-bold gradient-text hidden logo-text">
                                TipDoor
                            </span>
                        </Link>
                        <p className="text-sm text-[var(--muted-foreground)] max-w-xs leading-relaxed">
                            Your desired products, delivered to your doorstep. Quality dropshipping with fast delivery.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--foreground)] mb-4 text-lg">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/cart"
                                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/orders"
                                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--foreground)] mb-4 text-lg">
                            Contact
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                            Drop shipping store. Quality products, fast delivery. Your trusted partner for online shopping.
                        </p>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
                    © {new Date().getFullYear()} TipDoor. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
