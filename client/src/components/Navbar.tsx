// components/Navbar.tsx
import { Button } from "@/components/ui/button";

import {
    Menu,
    X,
    ArrowRight,
} from "lucide-react";

import { useState } from "react";

import { Link, useLocation } from "react-router-dom";

import LoginDialog from "./loginDialog"

const navItems = [
    {
        label: "Teams",
        path: "/teams",
    },
    {
        label: "Players",
        path: "/players",
    },
    {
        label: "Matches",
        path: "/matches",
    },
    {
        label: "Auction",
        path: "/auction",
    },
];

export default function Navbar() {
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const [loginOpen, setLoginOpen] =
        useState(false);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:py-4">
                    {/* LOGO */}
                    <Link
                        to="/"
                        className="group flex items-center gap-3"
                    >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-sm font-black text-black shadow-lg shadow-yellow-400/20 transition duration-300 group-hover:scale-105 sm:size-12">
                            RPL
                        </div>

                        <div>
                            <h1 className="text-sm font-black leading-none tracking-wide transition group-hover:text-yellow-400 sm:text-lg">
                                REDFORT
                            </h1>

                            <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-yellow-400 sm:text-sm">
                                PREMIER LEAGUE
                            </p>
                        </div>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden items-center gap-7 lg:flex">
                        {navItems.map((item) => {
                            const active =
                                location.pathname === item.path;

                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`text-sm font-semibold transition ${active
                                        ? "text-yellow-400"
                                        : "text-white/70 hover:text-yellow-400"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* LOGIN BUTTON */}
                    <div className="hidden lg:block">
                        <Button
                            onClick={() =>
                                setLoginOpen(true)
                            }
                            className="group relative h-11 overflow-hidden rounded-2xl border border-yellow-400/20 bg-[#111827] px-6 text-sm font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:border-yellow-400/40"
                        >
                            {/* YELLOW PATTERN */}

                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_35%)]" />

                            <div className="absolute -left-6 bottom-0 size-20 rounded-full bg-yellow-500/20 blur-2xl" />

                            <div className="absolute right-0 top-0 size-24 rounded-full bg-orange-500/20 blur-2xl" />

                            {/* CONTENT */}

                            <div className="relative z-10 flex items-center">
                                <span className="bg-linear-to-r from-yellow-200 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                    Login
                                </span>

                                <ArrowRight
                                    size={18}
                                    className="ml-2 text-yellow-300 transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </div>
                        </Button>
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() =>
                            setMobileMenuOpen(
                                !mobileMenuOpen,
                            )
                        }
                        className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-lg transition hover:bg-white/10 lg:hidden"
                    >
                        {mobileMenuOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>
                </div>

                {/* MOBILE MENU */}
                <div
                    className={`overflow-hidden transition-all duration-300 lg:hidden ${mobileMenuOpen
                        ? "max-h-100 opacity-100"
                        : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="border-t border-white/10 bg-[#0B1120]/95 backdrop-blur-2xl">
                        <div className="space-y-2 px-4 py-5">
                            {navItems.map((item) => {
                                const active =
                                    location.pathname ===
                                    item.path;

                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        onClick={() =>
                                            setMobileMenuOpen(
                                                false,
                                            )
                                        }
                                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${active
                                            ? "bg-yellow-400/15 text-yellow-300"
                                            : "bg-white/3 text-white/80 hover:bg-yellow-400/10 hover:text-yellow-300"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}

                            <Button
                                onClick={() =>
                                    setLoginOpen(true)
                                }
                                className="mt-3 h-11 w-full rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-sm font-bold"
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <LoginDialog
                open={loginOpen}
                onOpenChange={setLoginOpen}
            />
        </>
    );
}