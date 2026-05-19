// components/LoginDialog.tsx

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
    ShieldCheck,
    User,
    Users,
    Phone,
    Lock,
    ArrowRight,
    Sparkles,
    Trophy,
} from "lucide-react";

import { useState } from "react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type Role =
    | "player"
    | "owner"
    | "admin";

type RoleCardProps = {
    active: boolean;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    onClick: () => void;
    activeClass:
    | "yellow"
    | "blue"
    | "purple";
};

export default function LoginDialog({
    open,
    onOpenChange,
}: Props) {
    const [role, setRole] =
        useState<Role>("player");

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-h-[95vh] overflow-y-auto border border-white/10 bg-[#07111F] p-0 text-white sm:max-w-5xl">
                <div className="grid lg:grid-cols-2">

                    {/* LEFT SIDE */}

                    <div className="relative overflow-hidden bg-[#0A0F1C] p-6 lg:p-10">

                        {/* YELLOW PATTERN */}

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.25),transparent_35%)]" />

                        <div className="absolute -left-10 bottom-0 size-40 rounded-full bg-yellow-500/10 blur-3xl" />

                        <div className="absolute right-0 top-0 size-52 rounded-full bg-orange-500/10 blur-3xl" />

                        {/* LOGO */}

                        <div className="relative z-10 flex items-center gap-4">

                            <div className="flex size-16 items-center justify-center rounded-3xl bg-yellow-400 text-black shadow-2xl">

                                <Trophy size={30} />
                            </div>

                            <div>

                                <h2 className="text-4xl font-black tracking-tight text-white">
                                    RPL 2026
                                </h2>

                                <p className="mt-1 text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">
                                    Login Portal
                                </p>
                            </div>
                        </div>

                        {/* CONTENT */}

                        <div className="relative z-10 mt-14">

                            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">

                                <Sparkles size={16} />

                                Redfort Premier League
                            </div>

                            <h3 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">

                                Access The

                                <span className="block bg-linear-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                    RPL Dashboard
                                </span>
                            </h3>

                            <p className="mt-6 max-w-lg text-base leading-8 text-white/65">
                                Login as a player, owner, or admin
                                to access auctions, team management,
                                player stats, and tournament updates.
                            </p>
                        </div>

                        {/* STATS */}

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="bg-[#0B1120] p-6 sm:p-8">

                        {/* TOP */}

                        <div className="mb-8">

                            <div className="mb-6 grid grid-cols-3 gap-3">

                                <RoleCard
                                    active={
                                        role === "player"
                                    }
                                    title="Player"
                                    subtitle="Join Team"
                                    icon={
                                        <User size={22} />
                                    }
                                    activeClass="yellow"
                                    onClick={() =>
                                        setRole("player")
                                    }
                                />

                                <RoleCard
                                    active={
                                        role === "owner"
                                    }
                                    title="Owner"
                                    subtitle="Manage Team"
                                    icon={
                                        <Users size={22} />
                                    }
                                    activeClass="blue"
                                    onClick={() =>
                                        setRole("owner")
                                    }
                                />

                                <RoleCard
                                    active={
                                        role === "admin"
                                    }
                                    title="Admin"
                                    subtitle="Control"
                                    icon={
                                        <ShieldCheck size={22} />
                                    }
                                    activeClass="purple"
                                    onClick={() =>
                                        setRole("admin")
                                    }
                                />
                            </div>

                            <div>

                                <h3 className="text-3xl font-black">
                                    Login Now
                                </h3>

                                <p className="mt-2 text-sm text-white/60">
                                    Enter your credentials to continue
                                </p>
                            </div>
                        </div>

                        {/* FORM */}

                        <div className="space-y-5">

                            {/* PHONE */}

                            <div>

                                <p className="mb-2 text-sm font-semibold text-white/70">
                                    Phone Number
                                </p>

                                <div className="relative">

                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                        <Phone size={18} />
                                    </div>

                                    <Input
                                        placeholder="Enter mobile number"
                                        className="h-13 rounded-xl border-white/10 bg-white/5 pl-12 text-white placeholder:text-white/30"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}

                            {role !== "player" && (
                                <div>

                                    <p className="mb-2 text-sm font-semibold text-white/70">
                                        Password
                                    </p>

                                    <div className="relative">

                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                            <Lock size={18} />
                                        </div>

                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            className="h-13 rounded-xl border-white/10 bg-white/5 pl-12 text-white placeholder:text-white/30"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* BUTTONS */}

                            <div className="mt-6 flex gap-4">

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        onOpenChange(false)
                                    }
                                    className="h-13 flex-1 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                                >
                                    Cancel
                                </Button>

                                <Button className="group h-13 flex-1 rounded-xl bg-yellow-400 font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-yellow-500">
                                    Continue

                                    <ArrowRight
                                        size={18}
                                        className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </Button>
                            </div>

                            {/* FOOTER */}

                            <p className="pt-2 text-center text-xs leading-6 text-white/35">
                                Secure access to the official
                                Redfort Premier League management
                                portal.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ====================================================== */
/* ROLE CARD */
/* ====================================================== */

function RoleCard({
    active,
    title,
    subtitle,
    icon,
    onClick,
    activeClass,
}: RoleCardProps) {

    const activeStyles = {
        yellow:
            "border-yellow-400 bg-linear-to-br from-yellow-400/20 to-yellow-500/5",

        blue:
            "border-blue-400 bg-blue-500/10",

        purple:
            "border-purple-400 bg-purple-500/10",
    };

    const iconStyles = {
        yellow:
            "bg-yellow-400 text-black",

        blue:
            "bg-blue-500 text-white",

        purple:
            "bg-purple-500 text-white",
    };

    const textStyles = {
        yellow:
            "text-yellow-400",

        blue:
            "text-blue-400",

        purple:
            "text-purple-400",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02]

      ${active
                    ? activeStyles[
                    activeClass
                    ]
                    : "border-white/10 bg-white/5"
                }
      `}
        >
            <div className="relative z-10 flex flex-col items-center gap-2">

                <div
                    className={`flex size-12 items-center justify-center rounded-2xl

          ${active
                            ? iconStyles[
                            activeClass
                            ]
                            : "bg-white/10 text-white"
                        }
          `}
                >
                    {icon}
                </div>

                <div className="text-center">

                    <p
                        className={`font-bold

            ${active
                                ? textStyles[
                                activeClass
                                ]
                                : "text-white"
                            }
            `}
                    >
                        {title}
                    </p>

                    <p className="text-xs text-white/50">
                        {subtitle}
                    </p>
                </div>
            </div>
        </button>
    );
}