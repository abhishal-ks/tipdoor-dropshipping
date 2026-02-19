import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-16 bg-gradient-to-b from-[var(--primary-muted)] to-[var(--primary-muted)]/50 border-t border-[var(--primary-muted)]">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <Link
                            href="/"
                            className="text-xl font-bold text-[var(--primary)]"
                        >
                            TipDoor
                        </Link>
                        <p className="mt-2 text-sm text-gray-600 max-w-xs">
                            Your desired products, delivered to your doorstep.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-600 hover:text-[var(--primary)] transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/cart"
                                    className="text-gray-600 hover:text-[var(--primary)] transition-colors"
                                >
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/orders"
                                    className="text-gray-600 hover:text-[var(--primary)] transition-colors"
                                >
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-gray-600 hover:text-[var(--primary)] transition-colors"
                                >
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Contact
                        </h3>
                        <p className="text-sm text-gray-600">
                            Drop shipping store. Quality products, fast delivery.
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200/60 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} TipDoor. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
