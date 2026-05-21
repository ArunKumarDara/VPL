import Navbar from "@/components/Navbar";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
    Phone,
    Trophy,
    Shield,
    IndianRupee,
    Users,
    Crown,
    MapPin,
} from "lucide-react";

import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { getSinglePlayer } from "@/services/player/playerService";

const PlayerHomePage = () => {
    const { id } = useParams();

    const {
        data,
        isLoading,
    } = useQuery({
        queryKey: ["single-player", id],
        queryFn: () =>
            getSinglePlayer(id as string),
        enabled: !!id,
    });

    const player = data?.player;

    const teamPlayers =
        player?.currentTeam?.players || [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050816] text-white">
                <Navbar />

                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />

                        <p className="mt-5 text-white/60">
                            Loading Player...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
            <Navbar />

            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-violet-500/20 blur-[130px]" />

                <div className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[130px]" />

                <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-28">
                <div className="grid gap-6 lg:grid-cols-[370px_1fr]">
                    {/* LEFT PROFILE */}
                    <Card className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-2xl">
                        <CardContent className="p-0">
                            {/* IMAGE */}
                            <div className="relative">
                                <img
                                    src={
                                        player?.profileImage
                                    }
                                    alt={player?.name}
                                    className="h-[400px] w-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-black/20 to-transparent" />

                                <div className="absolute bottom-6 left-6">
                                    <Badge className="border-none bg-yellow-400 px-4 py-1 text-black">
                                        {
                                            player?.playingRole
                                        }
                                    </Badge>

                                    <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
                                        {player?.name}
                                    </h1>

                                    <p className="mt-2 flex items-center gap-2 text-white/70">
                                        <MapPin className="h-4 w-4" />

                                        {
                                            player?.village
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* INFO CARDS */}
                            <div className="space-y-4 p-6">
                                {/* MOBILE */}
                                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.06]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10">
                                            <Phone className="h-5 w-5 text-green-400" />
                                        </div>

                                        <div>
                                            <p className="text-xs text-white/40">
                                                Mobile
                                            </p>

                                            <h3 className="text-lg font-bold text-white">
                                                {
                                                    player?.mobile
                                                }
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* OWNER */}
                                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.06]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10">
                                            <Crown className="h-5 w-5 text-yellow-300" />
                                        </div>

                                        <div>
                                            <p className="text-xs text-white/40">
                                                Owner
                                            </p>

                                            <h3 className="text-lg font-bold text-white">
                                                {player
                                                    ?.currentTeam
                                                    ?.ownerName
                                                    ?.name ||
                                                    "Unsold"}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* TEAM */}
                                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.06]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                                            <Shield className="h-5 w-5 text-blue-400" />
                                        </div>

                                        <div>
                                            <p className="text-xs text-white/40">
                                                Team
                                            </p>

                                            <h3 className="text-lg font-bold text-white">
                                                {player
                                                    ?.currentTeam
                                                    ?.name ||
                                                    "No Team"}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        {/* STATS */}
                        <div className="grid gap-5 md:grid-cols-3">
                            {/* BASE */}
                            <Card className="rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
                                <CardContent className="p-6">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10">
                                        <IndianRupee className="text-yellow-300" />
                                    </div>

                                    <p className="mt-5 text-sm text-white/40">
                                        Base Price
                                    </p>

                                    <h2 className="mt-2 text-4xl font-black text-white">
                                        ₹
                                        {player?.basePrice ||
                                            0}
                                    </h2>
                                </CardContent>
                            </Card>

                            {/* SOLD */}
                            <Card className="rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
                                <CardContent className="p-6">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10">
                                        <Trophy className="text-green-400" />
                                    </div>

                                    <p className="mt-5 text-sm text-white/40">
                                        Sold Price
                                    </p>

                                    <h2 className="mt-2 text-4xl font-black text-white">
                                        ₹
                                        {player?.soldPrice ||
                                            0}
                                    </h2>
                                </CardContent>
                            </Card>

                            {/* TEAM PLAYERS */}
                            <Card className="rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
                                <CardContent className="p-6">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                                        <Users className="text-violet-400" />
                                    </div>

                                    <p className="mt-5 text-sm text-white/40">
                                        Team Players
                                    </p>

                                    <h2 className="mt-2 text-4xl font-black text-white">
                                        {
                                            teamPlayers.length
                                        }
                                    </h2>
                                </CardContent>
                            </Card>
                        </div>

                        {/* TEAM SQUAD */}
                        <Card className="rounded-[34px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
                            <CardContent className="p-7">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight text-white">
                                            Team Squad
                                        </h2>

                                        <p className="mt-1 text-white/40">
                                            {
                                                player
                                                    ?.currentTeam
                                                    ?.name
                                            }
                                        </p>
                                    </div>

                                    <Badge className="border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-yellow-300">
                                        {
                                            teamPlayers.length
                                        }{" "}
                                        Players
                                    </Badge>
                                </div>

                                <Separator className="my-6 bg-white/10" />

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {teamPlayers.map(
                                        (
                                            teamPlayer: any,
                                        ) => (
                                            <div
                                                key={
                                                    teamPlayer._id
                                                }
                                                className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/20 hover:bg-white/[0.06]"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-16 w-16 rounded-2xl border border-white/10">
                                                        <AvatarImage
                                                            src={
                                                                teamPlayer.profileImage
                                                            }
                                                        />
                                                    </Avatar>

                                                    <div>
                                                        <h3 className="text-lg font-black text-white">
                                                            {
                                                                teamPlayer.name
                                                            }
                                                        </h3>

                                                        <p className="text-sm text-white/40">
                                                            {
                                                                teamPlayer.playingRole
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-5 flex items-center justify-between">
                                                    <Badge
                                                        className={`${teamPlayer.soldStatus ===
                                                            "SOLD"
                                                            ? "border-green-500/20 bg-green-500/10 text-green-300"
                                                            : "border-red-500/20 bg-red-500/10 text-red-300"
                                                            }`}
                                                    >
                                                        {
                                                            teamPlayer.soldStatus
                                                        }
                                                    </Badge>

                                                    <div className="text-right">
                                                        <p className="text-xs text-white/40">
                                                            Sold
                                                        </p>

                                                        <h4 className="text-lg font-black text-yellow-300">
                                                            ₹
                                                            {teamPlayer.soldPrice ||
                                                                0}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerHomePage;