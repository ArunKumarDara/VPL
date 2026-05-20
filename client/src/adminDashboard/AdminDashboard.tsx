// pages/admin/AdminDashboard.tsx

import {
    Trophy,
    Users,
    UserPlus,
    Shield,
    Hammer,
    Calendar,
    CircleDot,
    Clock3,
    Sparkles,
    ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const stats = [
    {
        title: "Seasons",
        value: "03",
        icon: Trophy,
    },

    {
        title: "Teams",
        value: "12",
        icon: Shield,
    },

    {
        title: "Players",
        value: "240",
        icon: Users,
    },

    {
        title: "Owners",
        value: "12",
        icon: UserPlus,
    },
];

const quickActions = [
    {
        title: "Create Season",
        description: "Manage tournament seasons",
        icon: Trophy,
    },

    {
        title: "Add Owner",
        description: "Create and assign owners",
        icon: UserPlus,
    },

    {
        title: "Manage Players",
        description: "Edit player details",
        icon: Users,
    },

    {
        title: "Auction Settings",
        description: "Start or configure auction",
        icon: Hammer,
    },
];

const seasons = [
    {
        season: "Season 1",
        status: "Completed",
        teams: 8,
        players: 120,
    },

    {
        season: "Season 2",
        status: "Completed",
        teams: 10,
        players: 180,
    },

    {
        season: "Season 3",
        status: "Active",
        teams: 12,
        players: 240,
    },
];

const activity = [
    "Season 3 created",
    "New owner assigned",
    "Player base price updated",
    "Auction scheduled",
];

export default function AdminDashboard() {
    return (
        <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
            <Navbar />

            {/* BACKGROUND */}

            <div className="fixed inset-0 -z-10">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.08),transparent_35%)]" />

                <div className="absolute top-0 left-0 h-[450px] w-[450px] rounded-full bg-yellow-500/10 blur-[180px]" />

                <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[180px]" />

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

            </div>

            <div className="mx-auto max-w-7xl px-4 py-28">

                {/* HERO */}

                <div
                    className="
                    relative overflow-hidden
                    rounded-[36px]
                    border border-white/10
                    bg-[#0d1328]/90
                    backdrop-blur-2xl
                    shadow-2xl shadow-black/30
                    "
                >

                    <div className="absolute inset-0 bg-linear-to-br from-yellow-400/10 via-transparent to-orange-500/10" />

                    <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-yellow-400/20 blur-[120px]" />

                    <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-orange-500/10 blur-[120px]" />

                    <div className="relative z-10 p-8 md:p-12">

                        <div className="flex flex-wrap items-center gap-3">

                            <div
                                className="
                                flex items-center gap-2
                                rounded-full
                                border border-yellow-400/20
                                bg-yellow-400/10
                                px-4 py-2
                                text-sm font-semibold
                                text-yellow-300
                                "
                            >

                                <Sparkles size={16} />

                                Welcome Admin

                            </div>

                            <div
                                className="
                                rounded-full
                                border border-green-500/20
                                bg-green-500/10
                                px-4 py-2
                                text-sm font-semibold
                                text-green-300
                                "
                            >
                                Season 2026 Active
                            </div>

                        </div>

                        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">

                            <div>

                                <h1 className="text-5xl font-black leading-tight md:text-6xl">

                                    RPL Tournament

                                    <span
                                        className="
                                        mt-2 block
                                        bg-gradient-to-r
                                        from-yellow-300
                                        via-yellow-400
                                        to-orange-500
                                        bg-clip-text
                                        text-transparent
                                        "
                                    >
                                        Control Center
                                    </span>

                                </h1>

                                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">

                                    Manage seasons, owners, players, auction
                                    process and tournament activities from one
                                    modern dashboard.

                                </p>

                                <div className="mt-10 flex flex-wrap gap-4">

                                    <Button
                                        className="
                                        h-12 rounded-2xl
                                        bg-gradient-to-r
                                        from-yellow-300
                                        to-orange-400
                                        px-7
                                        font-bold
                                        text-black
                                        shadow-lg shadow-yellow-500/20
                                        transition-all duration-300
                                        hover:scale-105
                                        hover:shadow-yellow-500/30
                                        "
                                    >
                                        Create Season
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="
                                        h-12 rounded-2xl
                                        border-white/15
                                        bg-white/10
                                        px-7
                                        text-white
                                        backdrop-blur-xl
                                        transition-all duration-300
                                        hover:border-yellow-400/30
                                        hover:bg-yellow-400/10
                                        "
                                    >
                                        Start Auction
                                    </Button>

                                </div>

                            </div>

                            {/* HERO SIDE CARD */}

                            <div
                                className="
                                rounded-3xl
                                border border-white/10
                                bg-[#11182f]
                                p-6
                                backdrop-blur-xl
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-white/60">

                                            Current Season

                                        </p>

                                        <h2 className="mt-2 text-3xl font-black">

                                            Season 3

                                        </h2>

                                    </div>

                                    <div
                                        className="
                                        rounded-2xl
                                        bg-yellow-400/10
                                        p-4
                                        text-yellow-400
                                        "
                                    >
                                        <Trophy size={32} />
                                    </div>

                                </div>

                                <div className="mt-8 space-y-5">

                                    <div>

                                        <div className="mb-2 flex items-center justify-between text-sm font-medium">

                                            <span className="text-white/60">

                                                Tournament Progress

                                            </span>

                                            <span className="text-yellow-300">

                                                72%

                                            </span>

                                        </div>

                                        <div className="h-3 overflow-hidden rounded-full bg-white/10">

                                            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-yellow-300 to-orange-500" />

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4">

                                        <div className="rounded-2xl bg-white/5 p-4">

                                            <p className="text-sm font-medium text-white/60">

                                                Matches

                                            </p>

                                            <h3 className="mt-2 text-2xl font-bold">

                                                48

                                            </h3>

                                        </div>

                                        <div className="rounded-2xl bg-white/5 p-4">

                                            <p className="text-sm font-medium text-white/60">

                                                Live Teams

                                            </p>

                                            <h3 className="mt-2 text-2xl font-bold">

                                                12

                                            </h3>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* STATS */}

                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    {stats.map((item) => {

                        const Icon = item.icon;

                        return (

                            <Card
                                key={item.title}
                                className="
                                group
                                overflow-hidden
                                rounded-3xl
                                border border-white/10
                                bg-[#0f172d]
                                backdrop-blur-xl
                                transition-all duration-300
                                hover:-translate-y-1
                                hover:border-yellow-400/20
                                "
                            >

                                <CardContent className="relative p-6">

                                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-yellow-400/10 blur-3xl transition-all duration-300 group-hover:scale-150" />

                                    <div className="relative z-10 flex items-center justify-between">

                                        <div>

                                            <p className="text-sm font-medium text-white/60">

                                                {item.title}

                                            </p>

                                            <h2 className="mt-3 text-5xl font-black text-white">

                                                {item.value}

                                            </h2>

                                        </div>

                                        <div
                                            className="
                                            flex h-16 w-16
                                            items-center justify-center
                                            rounded-3xl
                                            border border-yellow-400/20
                                            bg-yellow-400/10
                                            text-yellow-400
                                            shadow-lg shadow-yellow-500/10
                                            "
                                        >

                                            <Icon size={30} />

                                        </div>

                                    </div>

                                </CardContent>

                            </Card>

                        );
                    })}

                </div>

                {/* QUICK ACTIONS */}

                <div className="mt-14">

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-3xl font-black">

                            Quick Actions

                        </h2>

                        <p className="text-sm font-medium text-white/50">

                            Tournament Management Tools

                        </p>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                        {quickActions.map((item) => {

                            const Icon = item.icon;

                            return (

                                <Card
                                    key={item.title}
                                    className="
                                    group
                                    cursor-pointer
                                    overflow-hidden
                                    rounded-3xl
                                    border border-white/10
                                    bg-[#0f172d]
                                    backdrop-blur-xl
                                    transition-all duration-300
                                    hover:-translate-y-2
                                    hover:border-yellow-400/20
                                    "
                                >

                                    <CardContent className="relative p-6">

                                        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-yellow-400/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <div
                                            className="
                                            flex h-16 w-16
                                            items-center justify-center
                                            rounded-3xl
                                            border border-yellow-400/20
                                            bg-yellow-400/10
                                            text-yellow-400
                                            transition-transform duration-300
                                            group-hover:scale-110
                                            "
                                        >
                                            <Icon size={28} />
                                        </div>

                                        <h3 className="mt-6 text-xl font-bold text-white">

                                            {item.title}

                                        </h3>

                                        <p className="mt-3 text-sm leading-6 text-white/65">

                                            {item.description}

                                        </p>

                                        <div
                                            className="
                                            mt-6 flex items-center gap-2
                                            text-sm font-semibold
                                            text-yellow-400
                                            "
                                        >

                                            Open

                                            <ChevronRight
                                                size={18}
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                            />

                                        </div>

                                    </CardContent>

                                </Card>

                            );
                        })}

                    </div>

                </div>

                {/* TABLE + ACTIVITY */}

                <div className="mt-14 grid gap-8 xl:grid-cols-3">

                    {/* SEASONS */}

                    <Card
                        className="
                        overflow-hidden
                        rounded-3xl
                        border border-white/10
                        bg-[#0f172d]
                        backdrop-blur-xl
                        xl:col-span-2
                        "
                    >

                        <CardContent className="p-7">

                            <div className="mb-7 flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                        rounded-2xl
                                        bg-yellow-400/10
                                        p-3
                                        text-yellow-400
                                        "
                                    >
                                        <Calendar size={22} />
                                    </div>

                                    <div>

                                        <h2 className="text-2xl font-black text-white">

                                            Seasons

                                        </h2>

                                        <p className="text-sm font-medium text-white/50">

                                            Tournament history & status

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="space-y-5">

                                {seasons.map((season) => (

                                    <div
                                        key={season.season}
                                        className="
                                        flex flex-col gap-5
                                        rounded-3xl
                                        border border-white/10
                                        bg-[#11182f]
                                        p-5
                                        transition-all duration-300
                                        hover:border-yellow-400/20
                                        md:flex-row
                                        md:items-center
                                        md:justify-between
                                        "
                                    >

                                        <div>

                                            <h3 className="text-lg font-bold text-white">

                                                {season.season}

                                            </h3>

                                            <p className="mt-2 text-sm font-medium text-white/60">

                                                Teams: {season.teams}
                                                {" • "}
                                                Players: {season.players}

                                            </p>

                                        </div>

                                        <div className="flex items-center gap-4">

                                            <div
                                                className={`
                                                rounded-full
                                                border
                                                px-5 py-2
                                                text-sm font-semibold

                                                ${season.status === "Active"
                                                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                                                        : "border-blue-500/20 bg-blue-500/10 text-blue-300"
                                                    }
                                                `}
                                            >

                                                {season.status}

                                            </div>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
                                            >
                                                View
                                            </Button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </CardContent>

                    </Card>

                    {/* ACTIVITY */}

                    <Card
                        className="
                        overflow-hidden
                        rounded-3xl
                        border border-white/10
                        bg-[#0f172d]
                        backdrop-blur-xl
                        "
                    >

                        <CardContent className="p-7">

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                    rounded-2xl
                                    bg-yellow-400/10
                                    p-3
                                    text-yellow-400
                                    "
                                >
                                    <Clock3 size={22} />
                                </div>

                                <div>

                                    <h2 className="text-2xl font-black text-white">

                                        Activity

                                    </h2>

                                    <p className="text-sm font-medium text-white/50">

                                        Recent updates

                                    </p>

                                </div>

                            </div>

                            <div className="mt-8 space-y-6">

                                {activity.map((item) => (

                                    <div
                                        key={item}
                                        className="
                                        flex gap-4
                                        rounded-2xl
                                        border border-white/5
                                        bg-[#11182f]
                                        p-4
                                        "
                                    >

                                        <div
                                            className="
                                            mt-1 flex h-9 w-9
                                            items-center justify-center
                                            rounded-full
                                            bg-yellow-400/10
                                            "
                                        >
                                            <CircleDot
                                                size={16}
                                                className="text-yellow-400"
                                            />
                                        </div>

                                        <div>

                                            <p className="font-medium text-white">

                                                {item}

                                            </p>

                                            <p className="mt-1 text-xs font-medium text-white/50">

                                                Just now

                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div>
    );
}