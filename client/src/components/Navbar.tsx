// components/Navbar.tsx

import { Button } from "@/components/ui/button";

import {
    Menu,
    X,
    ArrowRight,
    LogOut,
    ShieldCheck,
    TriangleAlert,
} from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { useState, useEffect } from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import LoginDialog from "./loginDialog";

import { useAuthStore } from "@/store/authStore";

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

    const navigate = useNavigate();

    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] = useState(false);

    const [loginOpen, setLoginOpen] =
        useState(false);

    const { user, logout } =
        useAuthStore();

    // AUTO REDIRECT BASED ON ROLE
    useEffect(() => {
        // ADMIN
        if (
            user?.role === "ADMIN" &&
            !location.pathname.startsWith(
                "/admin",
            )
        ) {
            navigate("/admin", {
                replace: true,
            });
        }

        // OWNER
        if (
            user?.role === "OWNER" &&
            !location.pathname.startsWith(
                "/owner",
            )
        ) {
            navigate("/owner", {
                replace: true,
            });
        }
    }, [
        user,
        location.pathname,
        navigate,
    ]);

    const handleLogout = () => {
        logout();

        navigate("/");
    };

    const isAdmin =
        user?.role === "ADMIN";

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:py-4">
                    {/* LOGO */}
                    {isAdmin ? (
                        <div className="group flex cursor-default items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-yellow-400 font-black text-black">
                                RPL
                            </div>

                            <div>
                                <h1 className="font-black text-white">
                                    REDFORT
                                </h1>

                                <p className="text-xs text-yellow-400">
                                    PREMIER LEAGUE
                                </p>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/"
                            className="group flex items-center gap-3"
                        >
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-yellow-400 font-black text-black transition group-hover:scale-110">
                                RPL
                            </div>

                            <div>
                                <h1 className="font-black transition group-hover:text-yellow-400">
                                    REDFORT
                                </h1>

                                <p className="text-xs text-yellow-400">
                                    PREMIER LEAGUE
                                </p>
                            </div>
                        </Link>
                    )}

                    {/* DESKTOP MENU */}
                    {!isAdmin && (
                        <nav className="hidden items-center gap-7 lg:flex">
                            {navItems.map(
                                (item) => {
                                    const active =
                                        location.pathname ===
                                        item.path;

                                    return (
                                        <Link
                                            key={
                                                item.label
                                            }
                                            to={
                                                item.path
                                            }
                                            className={`font-semibold transition
                                            ${active
                                                    ? "text-yellow-400"
                                                    : "text-white/70 hover:text-yellow-400"
                                                }
                                            `}
                                        >
                                            {
                                                item.label
                                            }
                                        </Link>
                                    );
                                },
                            )}
                        </nav>
                    )}

                    {/* RIGHT SECTION */}
                    <div className="hidden items-center gap-4 lg:flex">
                        {user ? (
                            <>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div
                                            className="
                                            flex cursor-pointer items-center gap-3
                                            rounded-2xl
                                            border border-white/10
                                            bg-white/5
                                            px-3 py-2
                                            backdrop-blur-xl
                                            transition-all duration-300
                                            hover:border-yellow-400/30
                                            hover:bg-white/10
                                            "
                                        >
                                            <img
                                                src={
                                                    user.profileImage
                                                }
                                                alt={
                                                    user.name
                                                }
                                                className="
                                                size-11
                                                rounded-full
                                                border-2 border-yellow-400
                                                object-cover
                                                "
                                            />

                                            <div>
                                                <h3 className="text-sm font-bold text-white">
                                                    {
                                                        user.name
                                                    }
                                                </h3>

                                                <p className="text-xs text-yellow-400">
                                                    {
                                                        user.role
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        align="end"
                                        className="
                                        w-80
                                        overflow-hidden
                                        rounded-3xl
                                        border border-white/10
                                        bg-[#09111f]/95
                                        p-0
                                        text-white
                                        backdrop-blur-3xl
                                        "
                                    >
                                        {/* Top Glow */}
                                        <div
                                            className="
                                            absolute right-0 top-0
                                            size-32 rounded-full
                                            bg-yellow-400/15 blur-3xl
                                            "
                                        />

                                        <div className="relative">
                                            {/* USER INFO */}
                                            <div
                                                className="
                                                border-b border-white/10
                                                p-5
                                                "
                                            >
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={
                                                            user.profileImage
                                                        }
                                                        alt={
                                                            user.name
                                                        }
                                                        className="
                                                        size-16
                                                        rounded-full
                                                        border-2 border-yellow-400
                                                        object-cover
                                                        "
                                                    />

                                                    <div>
                                                        <h3 className="text-lg font-bold">
                                                            {
                                                                user.name
                                                            }
                                                        </h3>

                                                        <div className="flex items-center gap-2">
                                                            <ShieldCheck
                                                                size={
                                                                    14
                                                                }
                                                                className="text-green-400"
                                                            />

                                                            <span className="text-sm text-yellow-400">
                                                                {
                                                                    user.role
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* MENU */}
                                            <div className="p-5">
                                                <button
                                                    onClick={() => {
                                                        navigate(
                                                            `/players/${user._id}`,
                                                        );
                                                    }}
                                                    className="
                                                    flex w-full items-center justify-between
                                                    rounded-2xl
                                                    border border-white/10
                                                    bg-white/[0.03]
                                                    px-4 py-4
                                                    text-left
                                                    transition-all duration-300
                                                    hover:border-yellow-400/30
                                                    hover:bg-yellow-400/10
                                                    "
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-white">
                                                            My
                                                            Profile
                                                        </p>

                                                        <p className="mt-1 text-xs text-white/45">
                                                            View
                                                            your
                                                            player
                                                            profile
                                                            details
                                                        </p>
                                                    </div>

                                                    <ArrowRight
                                                        size={
                                                            18
                                                        }
                                                        className="text-yellow-300"
                                                    />
                                                </button>
                                            </div>

                                            {/* LOGOUT SECTION */}
                                            <div className="px-5 pb-5">
                                                <div
                                                    className="
                                                    mb-4 flex items-start gap-3
                                                    rounded-2xl
                                                    bg-red-500/10
                                                    p-3
                                                    "
                                                >
                                                    <TriangleAlert
                                                        size={
                                                            18
                                                        }
                                                        className="mt-0.5 text-red-400"
                                                    />

                                                    <div>
                                                        <p className="font-medium">
                                                            Ready
                                                            to
                                                            leave?
                                                        </p>

                                                        <p className="text-xs text-white/50">
                                                            Your
                                                            session
                                                            will
                                                            end
                                                            and
                                                            you'll
                                                            need
                                                            to
                                                            login
                                                            again.
                                                        </p>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={
                                                        handleLogout
                                                    }
                                                    className="
                                                    h-11
                                                    w-full
                                                    rounded-2xl
                                                    bg-linear-to-r
                                                    from-red-500
                                                    to-red-600
                                                    font-semibold
                                                    transition-all
                                                    hover:scale-[1.02]
                                                    "
                                                >
                                                    Logout

                                                    <LogOut
                                                        size={
                                                            16
                                                        }
                                                        className="ml-2"
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </>
                        ) : (
                            <Button
                                onClick={() =>
                                    setLoginOpen(
                                        true,
                                    )
                                }
                                className="group rounded-2xl border border-yellow-400/20 bg-[#111827]"
                            >
                                Login

                                <ArrowRight
                                    size={18}
                                    className="ml-2 transition group-hover:translate-x-1"
                                />
                            </Button>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() =>
                            setMobileMenuOpen(
                                !mobileMenuOpen,
                            )
                        }
                        className="lg:hidden"
                    >
                        {mobileMenuOpen ? (
                            <X />
                        ) : (
                            <Menu />
                        )}
                    </button>
                </div>

                {/* MOBILE MENU */}
                <div
                    className={`
                    lg:hidden overflow-hidden
                    transition-all duration-500 ease-in-out
                    ${mobileMenuOpen
                            ? "max-h-125 opacity-100"
                            : "max-h-0 opacity-0"
                        }
                    `}
                >
                    <div
                        className="
                        border-t border-white/10
                        bg-[#0B1120]/95
                        px-4 py-5
                        backdrop-blur-2xl
                        "
                    >
                        {/* NAV LINKS */}
                        {!isAdmin && (
                            <div className="space-y-2">
                                {navItems.map(
                                    (item) => {
                                        const active =
                                            location.pathname ===
                                            item.path;

                                        return (
                                            <Link
                                                key={
                                                    item.label
                                                }
                                                to={
                                                    item.path
                                                }
                                                onClick={() =>
                                                    setMobileMenuOpen(
                                                        false,
                                                    )
                                                }
                                                className={`
                                                flex rounded-xl px-4 py-3
                                                font-semibold transition-all

                                                ${active
                                                        ? "bg-yellow-400 text-black"
                                                        : "bg-white/5 text-white hover:bg-white/10"
                                                    }
                                                `}
                                            >
                                                {
                                                    item.label
                                                }
                                            </Link>
                                        );
                                    },
                                )}
                            </div>
                        )}

                        {/* LOGIN / LOGOUT */}
                        <div className="mt-5">
                            {user ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div
                                            className="
                                            flex cursor-pointer items-center gap-3
                                            rounded-2xl
                                            border border-white/10
                                            bg-white/5
                                            px-3 py-2
                                            backdrop-blur-xl
                                            transition-all duration-300
                                            hover:border-yellow-400/30
                                            hover:bg-white/10
                                            "
                                        >
                                            <img
                                                src={
                                                    user.profileImage
                                                }
                                                alt={
                                                    user.name
                                                }
                                                className="
                                                size-11
                                                rounded-full
                                                border-2 border-yellow-400
                                                object-cover
                                                "
                                            />

                                            <div>
                                                <h3 className="text-sm font-bold text-white">
                                                    {
                                                        user.name
                                                    }
                                                </h3>

                                                <p className="text-xs text-yellow-400">
                                                    {
                                                        user.role
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        align="end"
                                        className="
                                        w-80
                                        overflow-hidden
                                        rounded-3xl
                                        border border-white/10
                                        bg-[#09111f]/95
                                        p-0
                                        text-white
                                        backdrop-blur-3xl
                                        "
                                    >
                                        {/* Top Glow */}
                                        <div
                                            className="
                                            absolute right-0 top-0
                                            size-32 rounded-full
                                            bg-yellow-400/15 blur-3xl
                                            "
                                        />

                                        <div className="relative">
                                            {/* USER INFO */}
                                            <div
                                                className="
                                                border-b border-white/10
                                                p-5
                                                "
                                            >
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={
                                                            user.profileImage
                                                        }
                                                        alt={
                                                            user.name
                                                        }
                                                        className="
                                                        size-16
                                                        rounded-full
                                                        border-2 border-yellow-400
                                                        object-cover
                                                        "
                                                    />

                                                    <div>
                                                        <h3 className="text-lg font-bold">
                                                            {
                                                                user.name
                                                            }
                                                        </h3>

                                                        <div className="flex items-center gap-2">
                                                            <ShieldCheck
                                                                size={
                                                                    14
                                                                }
                                                                className="text-green-400"
                                                            />

                                                            <span className="text-sm text-yellow-400">
                                                                {
                                                                    user.role
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* MENU */}
                                            <div className="p-5">
                                                <button
                                                    onClick={() => {
                                                        navigate(
                                                            `/players/${user._id}`,
                                                        );

                                                        setMobileMenuOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className="
                                                    flex w-full items-center justify-between
                                                    rounded-2xl
                                                    border border-white/10
                                                    bg-white/[0.03]
                                                    px-4 py-4
                                                    text-left
                                                    transition-all duration-300
                                                    hover:border-yellow-400/30
                                                    hover:bg-yellow-400/10
                                                    "
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-white">
                                                            My
                                                            Profile
                                                        </p>

                                                        <p className="mt-1 text-xs text-white/45">
                                                            View
                                                            your
                                                            player
                                                            profile
                                                            details
                                                        </p>
                                                    </div>

                                                    <ArrowRight
                                                        size={
                                                            18
                                                        }
                                                        className="text-yellow-300"
                                                    />
                                                </button>
                                            </div>

                                            {/* LOGOUT SECTION */}
                                            <div className="px-5 pb-5">
                                                <div
                                                    className="
                                                    mb-4 flex items-start gap-3
                                                    rounded-2xl
                                                    bg-red-500/10
                                                    p-3
                                                    "
                                                >
                                                    <TriangleAlert
                                                        size={
                                                            18
                                                        }
                                                        className="mt-0.5 text-red-400"
                                                    />

                                                    <div>
                                                        <p className="font-medium">
                                                            Ready
                                                            to
                                                            leave?
                                                        </p>

                                                        <p className="text-xs text-white/50">
                                                            Your
                                                            session
                                                            will
                                                            end
                                                            and
                                                            you'll
                                                            need
                                                            to
                                                            login
                                                            again.
                                                        </p>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={
                                                        handleLogout
                                                    }
                                                    className="
                                                    h-11
                                                    w-full
                                                    rounded-2xl
                                                    bg-linear-to-r
                                                    from-red-500
                                                    to-red-600
                                                    font-semibold
                                                    transition-all
                                                    hover:scale-[1.02]
                                                    "
                                                >
                                                    Logout

                                                    <LogOut
                                                        size={
                                                            16
                                                        }
                                                        className="ml-2"
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Button
                                    onClick={() => {
                                        setLoginOpen(
                                            true,
                                        );

                                        setMobileMenuOpen(
                                            false,
                                        );
                                    }}
                                    className="
                                    w-full rounded-xl
                                    bg-linear-to-r
                                    from-yellow-300
                                    to-orange-400
                                    font-bold text-black
                                    "
                                >
                                    Login

                                    <ArrowRight
                                        size={16}
                                        className="ml-2"
                                    />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {!user && (
                <LoginDialog
                    open={loginOpen}
                    onOpenChange={
                        setLoginOpen
                    }
                />
            )}
        </>
    );
}