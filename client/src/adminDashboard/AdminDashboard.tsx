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

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Navbar from "@/components/Navbar";

import { getAllSeasons } from "@/services/seasons/seasonsService"
import { getAllTeams } from "@/services/team/teamService";
import { getAllPlayers } from "@/services/player/playerService";
import { getAllOwners } from "@/services/owner/ownerService";
import { useState } from "react";
import RegisterDialog from "@/components/RegisterDialog";
import CreateTeamDialog from "@/components/createTeamDialog";
import { Season } from "@/api/seasonApi";
import CreateSeasonDialog from "@/components/CreateSeasonDialog";

const quickActions = [

    {
        title: "Add Owner",
        description: "Create and assign owners",
        icon: UserPlus,
        action: "OPEN_OWNER_MODAL",
    },
    {
        title: "Create Team",
        description: "Manage Owner Team",
        icon: Trophy,
        action: "OPEN_TEAM_MODAL",
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

const activity = [
    "Season created",
    "New owner assigned",
    "Player registered",
    "Auction configured",
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [openOwnerModal, setOpenOwnerModal] = useState(false);
    const [openTeamModal, setOpenTeamModal] = useState(false);
    const [openSeasonModal, setOpenSeasonModal] =
        useState(false);
    const {
        data: seasons = [],
        isLoading: seasonsLoading,
    } = useQuery({
        queryKey: ["all-seasons"],
        queryFn: getAllSeasons,
    });

    const {
        data: teams,
        isLoading: teamsLoading,
    } = useQuery({
        queryKey: ["all-teams"],
        queryFn: getAllTeams,
    });

    const {
        data: players,
        isLoading: playersLoading,
    } = useQuery({
        queryKey: ["all-players"],
        queryFn: getAllPlayers,
    });

    const {
        data: owners,
        isLoading: ownersLoading,
    } = useQuery({
        queryKey: ["all-owners"],
        queryFn: getAllOwners,
    });

    const isLoading =
        seasonsLoading ||
        teamsLoading ||
        playersLoading ||
        ownersLoading;

    const latestSeason =
        seasons.length > 0
            ? seasons[0]
            : null;


    const stats = [
        {
            title: "Seasons",
            value: String(seasons.length).padStart(2, "0"),
            icon: Trophy,
        },

        {
            title: "Teams",
            value: String(teams?.count).padStart(2, "0"),
            icon: Shield,
        },

        {
            title: "Players",
            value: String(players?.totalPlayers).padStart(2, "0"),
            icon: Users,
        },

        {
            title: "Owners",
            value: String(owners?.totalOwners).padStart(2, "0"),
            icon: UserPlus,
        },
    ];

    return (
        <div className="min-h-screen overflow-hidden bg-[#050816] text-white">

            <Navbar />

            {/* BACKGROUND */}

            <div className="fixed inset-0 -z-10">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.08),transparent_35%)]" />

                <div className="absolute top-0 left-0 h-112.5 w-112.5 rounded-full bg-yellow-500/10 blur-[180px]" />

                <div className="absolute bottom-0 right-0 h-112.5 w-112.5 rounded-full bg-orange-500/10 blur-[180px]" />

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size:70px_70px] opacity-20" />

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

                            {latestSeason && (
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

                                    {latestSeason.title} - {latestSeason.status}

                                </div>
                            )}

                        </div>

                        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">

                            <div>

                                <h1 className="text-5xl font-black leading-tight md:text-6xl">

                                    RPL Tournament

                                    <span
                                        className="
                                        mt-2 block
                                        bg-linear-to-r
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
                                        onClick={() =>
                                            setOpenSeasonModal(true)
                                        }
                                        className="
                                        h-12 rounded-2xl
                                        bg-linear-to-r
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

                                </div>

                            </div>

                            {/* HERO SIDE CARD */}

                            <div
                                className="
    relative overflow-hidden
    rounded-3xl
    border border-white/10
    bg-[#11182f]
    p-6
    backdrop-blur-xl
    "
                            >

                                {/* GLOW */}

                                <div className="absolute inset-0 bg-linear-to-br from-yellow-400/5 via-transparent to-orange-500/5" />

                                {/* IF SEASON EXISTS */}

                                {latestSeason ? (

                                    <div className="relative z-10">

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <p className="text-sm font-medium text-white/60">

                                                    Current Season

                                                </p>

                                                <h2 className="mt-2 text-3xl font-black">

                                                    {latestSeason.title}

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

                                            <div className="grid grid-cols-2 gap-4">

                                                <div className="rounded-2xl bg-white/5 p-4">

                                                    <p className="text-sm font-medium text-white/60">

                                                        Teams

                                                    </p>

                                                    <h3 className="mt-2 text-2xl font-bold">

                                                        {latestSeason?.teams?.length || 0}

                                                    </h3>

                                                </div>

                                                <div className="rounded-2xl bg-white/5 p-4">

                                                    <p className="text-sm font-medium text-white/60">

                                                        Players

                                                    </p>

                                                    <h3 className="mt-2 text-2xl font-bold">

                                                        {latestSeason?.registeredPlayers?.length || 0}

                                                    </h3>

                                                </div>

                                            </div>

                                            <div
                                                className="
                    flex items-center justify-between
                    rounded-2xl border border-green-500/20
                    bg-green-500/10 px-4 py-3
                    "
                                            >

                                                <div>

                                                    <p className="text-xs text-green-200/70">

                                                        Status

                                                    </p>

                                                    <p className="font-semibold text-green-300">

                                                        {latestSeason.status}

                                                    </p>

                                                </div>

                                                <Sparkles
                                                    className="text-green-300"
                                                    size={22}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                ) : (

                                    /* EMPTY STATE */

                                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">

                                        <div
                                            className="
                flex h-24 w-24 items-center justify-center
                rounded-full
                border border-yellow-400/20
                bg-yellow-400/10
                text-yellow-400
                shadow-lg shadow-yellow-500/20
                "
                                        >

                                            <Calendar size={42} />

                                        </div>

                                        <h2 className="mt-8 text-3xl font-black">

                                            No Season Yet

                                        </h2>

                                        <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">

                                            Start your RPL tournament journey by creating the first season.
                                            Manage teams, owners, players and auctions from one dashboard.

                                        </p>

                                        <Button
                                            className="
                mt-8 h-12 rounded-2xl
                bg-linear-to-r
                from-yellow-300
                to-orange-400
                px-8
                font-bold
                text-black
                shadow-lg shadow-yellow-500/20
                transition-all duration-300
                hover:scale-105
                hover:shadow-yellow-500/40
                "
                                        >

                                            <Sparkles
                                                size={18}
                                                className="mr-2"
                                            />

                                            Create First Season

                                        </Button>

                                    </div>

                                )}

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
                                group overflow-hidden rounded-3xl
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

                                                {isLoading ? "--" : item.value}

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
                                    onClick={() => {

                                        if (item.action === "OPEN_OWNER_MODAL") {
                                            setOpenOwnerModal(true);
                                        }

                                        if (item.action === "OPEN_TEAM_MODAL") {
                                            setOpenTeamModal(true);
                                        }
                                    }}
                                    className="
                                    group cursor-pointer overflow-hidden rounded-3xl
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
                                            flex h-16 w-16 items-center justify-center
                                            rounded-3xl border border-yellow-400/20
                                            bg-yellow-400/10 text-yellow-400
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
                                            text-sm font-semibold text-yellow-400
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

                {/* SEASONS + ACTIVITY */}

                <div className="mt-14 grid gap-8 xl:grid-cols-3">

                    {/* SEASONS */}

                    <Card
                        className="
                        overflow-hidden rounded-3xl
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
                                        p-3 text-yellow-400
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

                                {seasons.map((season: Season) => (

                                    <div
                                        key={season._id}
                                        className="
                                        flex flex-col gap-5 rounded-3xl
                                        border border-white/10
                                        bg-[#11182f]
                                        p-5 transition-all duration-300
                                        hover:border-yellow-400/20
                                        md:flex-row md:items-center md:justify-between
                                        "
                                    >

                                        <div>

                                            <h3 className="text-lg font-bold text-white">

                                                {season.title}

                                            </h3>

                                            <p className="mt-2 text-sm font-medium text-white/60">

                                                Teams: {season.teams?.length || 0}
                                                {" • "}
                                                Players: {season.registeredPlayers?.length || 0}
                                                {" • "}
                                                Owners: {season.owners?.length || 0}

                                            </p>

                                        </div>

                                        <div className="flex items-center gap-4">

                                            <div
                                                className={`
                                                rounded-full border px-5 py-2
                                                text-sm font-semibold

                                                ${season.status === "LIVE"
                                                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                                                        : season.status === "COMPLETED"
                                                            ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                                                            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                                                    }
                                                `}
                                            >

                                                {season.status}

                                            </div>

                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/seasons/${season._id}/control-center`
                                                    )
                                                }
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

                    {/* RPL INFO CARD */}

                    <Card
                        className="
    overflow-hidden rounded-3xl
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
                                    <Trophy size={22} />
                                </div>

                                <div>

                                    <h2 className="text-2xl font-black text-white">

                                        RPL Insights

                                    </h2>

                                    <p className="text-sm font-medium text-white/50">

                                        Tournament overview

                                    </p>

                                </div>

                            </div>

                            <div className="mt-8 space-y-5">

                                <div
                                    className="
                rounded-2xl
                border border-white/10
                bg-[#11182f]
                p-5
                "
                                >
                                    <p className="text-sm text-white/60">

                                        Current Season

                                    </p>

                                    <h3 className="mt-2 text-2xl font-black text-yellow-300">

                                        {latestSeason?.title || "Not Created"}

                                    </h3>

                                </div>

                                <div
                                    className="
                rounded-2xl
                border border-white/10
                bg-[#11182f]
                p-5
                "
                                >
                                    <p className="text-sm text-white/60">

                                        Tournament Status

                                    </p>

                                    <div
                                        className={`
                    mt-3 inline-flex rounded-full px-4 py-2
                    text-sm font-bold

                    ${latestSeason?.status === "LIVE"
                                                ? "bg-green-500/10 text-green-400"
                                                : latestSeason?.status === "COMPLETED"
                                                    ? "bg-blue-500/10 text-blue-400"
                                                    : "bg-yellow-500/10 text-yellow-300"
                                            }
                    `}
                                    >

                                        {latestSeason?.status || "UPCOMING"}

                                    </div>

                                </div>

                                <div
                                    className="
                rounded-2xl
                border border-white/10
                bg-[#11182f]
                p-5
                "
                                >

                                    <p className="text-sm text-white/60">

                                        Registered Progress

                                    </p>

                                    <div className="mt-4 space-y-3">

                                        <div>

                                            <div className="flex justify-between text-sm">

                                                <span className="text-white/70">

                                                    Teams

                                                </span>

                                                <span className="font-bold">

                                                    {teams?.count || 0}

                                                </span>

                                            </div>

                                            <div className="mt-2 h-2 rounded-full bg-white/10">

                                                <div
                                                    className="h-full rounded-full bg-yellow-400"
                                                    style={{
                                                        width: `${Math.min(
                                                            ((teams?.count || 0) / 10) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>

                                        </div>

                                        <div>

                                            <div className="flex justify-between text-sm">

                                                <span className="text-white/70">

                                                    Players

                                                </span>

                                                <span className="font-bold">

                                                    {players?.totalPlayers || 0}

                                                </span>

                                            </div>

                                            <div className="mt-2 h-2 rounded-full bg-white/10">

                                                <div
                                                    className="h-full rounded-full bg-orange-400"
                                                    style={{
                                                        width: `${Math.min(
                                                            ((players?.totalPlayers || 0) /
                                                                100) *
                                                            100,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div
                                    className="
                rounded-2xl
                border border-yellow-400/20
                bg-yellow-400/10
                p-5
                "
                                >

                                    <p className="text-sm text-yellow-200">

                                        Tip

                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-white/80">

                                        Create teams and register players before
                                        starting the auction process.

                                    </p>

                                </div>

                            </div>

                        </CardContent>

                    </Card>

                </div>

            </div>
            <RegisterDialog
                open={openOwnerModal}
                onOpenChange={setOpenOwnerModal}
                defaultRole="OWNER"
            />
            <CreateTeamDialog
                open={openTeamModal}
                onOpenChange={setOpenTeamModal}
            />
            <CreateSeasonDialog
                open={openSeasonModal}
                onOpenChange={
                    setOpenSeasonModal
                }
            />

        </div>
    );
}