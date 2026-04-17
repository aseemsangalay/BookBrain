"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/log", label: "Log" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { isSignedIn, isLoaded } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="font-serif text-accent text-lg font-medium tracking-tight hover:text-ink transition-colors"
                >
                    BrainLog
                </Link>

                {/* Nav */}
                <nav className="hidden sm:flex items-center gap-6">
                    {isSignedIn &&
                        NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-label font-mono uppercase tracking-widest transition-colors ${pathname === link.href
                                    ? "text-accent"
                                    : "text-muted hover:text-muted-light"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                </nav>

                {/* Auth */}
                <div className="flex items-center gap-3">
                    {!isLoaded ? null : isSignedIn ? (
                        <UserButton afterSignOutUrl="/" />
                    ) : (
                        <>
                            <SignInButton mode="redirect">
                                <button className="btn-ghost text-xs py-1.5 px-3">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="redirect">
                                <button className="btn-primary text-xs py-1.5 px-3">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
