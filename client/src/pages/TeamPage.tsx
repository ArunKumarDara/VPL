// pages/TeamsPage.tsx

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

import {
    Trophy,
    Users,
    Crown,
    IndianRupee,
    ChevronRight,
    Search,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { getAllSeasons } from "@/services/seasons/seasonsService";
import { getSeasonById } from "@/services/seasons/seasonsService";

export default function TeamsPage() {
    const [selectedSeasonId, setSelectedSeasonId] =
        useState("");

    const [selectedTeam, setSelectedTeam] =
        useState<any>(null);

    const [teamDialogOpen, setTeamDialogOpen] =
        useState(false);

    const [search, setSearch] = useState("");

    // ALL SEASONS
    const { data: seasonsData } = useQuery({
        queryKey: ["all-seasons"],
        queryFn: getAllSeasons,
    });

    // SELECTED SEASON DETAILS
    const { data: season } = useQuery({
        queryKey: ["season-details", selectedSeasonId],
        queryFn: () =>
            getSeasonById(selectedSeasonId),
        enabled: !!selectedSeasonId,
    });

    const teams = season?.teams || [];

    const filteredTeams = useMemo(() => {
        return teams.filter((team: any) =>
            team?.name
                ?.toLowerCase()
                .includes(search.toLowerCase()),
        );
    }, [teams, search]);

    return (
        <div className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-yellow-500/8 blur-[120px]" />

                <div className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-orange-500/8 blur-[120px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-28">
                {/* HERO */}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <Badge className="border border-yellow-400/20 bg-yellow-400/10 px-4 p-2 text-yellow-300">
                            <Trophy className="mr-2 h-5 w-5" />
                            TEAM AUCTION CENTER
                        </Badge>

                        <h1 className="mt-6 text-3xl font-black tracking-tight text-white md:text-5xl">
                            Teams
                        </h1>

                        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/50">
                            Explore season teams, owners,
                            purse details and purchased
                            players.
                        </p>
                    </div>

                    {/* FILTERS */}
                    <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row">
                        <div className="relative w-full lg:w-[320px]">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                            <Input
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value,
                                    )
                                }
                                placeholder="Search teams..."
                                className="h-13 rounded-2xl border-white/10 bg-[#0B1220] pl-11 text-white placeholder:text-white/30 focus-visible:ring-yellow-400"
                            />
                        </div>

                        <Select
                            value={selectedSeasonId}
                            onValueChange={
                                setSelectedSeasonId
                            }
                        >
                            <SelectTrigger className="h-13 w-full rounded-2xl border-white/10 bg-[#0B1220] text-white lg:w-[260px]">
                                <SelectValue placeholder="Select Season" />
                            </SelectTrigger>

                            <SelectContent className="border-white/10 bg-[#0B1220] text-white">
                                {seasonsData?.map(
                                    (season: any) => (
                                        <SelectItem
                                            key={
                                                season._id
                                            }
                                            value={
                                                season._id
                                            }
                                        >
                                            {
                                                season.title
                                            }
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* EMPTY */}
                {!selectedSeasonId ? (
                    <div className="mt-16 flex min-h-80 flex-col items-center justify-center rounded-[36px] border border-dashed border-white/10 bg-[#0B1220]/70 text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400/10">
                            <Trophy className="h-12 w-12 text-yellow-300" />
                        </div>

                        <h2 className="mt-8 text-4xl font-black">
                            Select a Season
                        </h2>

                        <p className="mt-3 text-white/50">
                            Choose a season to view all
                            participating teams.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* TEAM GRID */}
                        <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredTeams.map((team: any) => {
                                const owner = season?.owners?.find(
                                    (o: any) => o?.team?._id === team._id,
                                );

                                const players =
                                    owner?.boughtPlayers || [];

                                const spent = players.reduce(
                                    (
                                        total: number,
                                        player: any,
                                    ) =>
                                        total +
                                        (player.purchasePrice ||
                                            player.soldPrice ||
                                            0),
                                    0,
                                );

                                return (
                                    <button
                                        key={team._id}
                                        onClick={() => {
                                            setSelectedTeam({
                                                ...team,
                                                owner,
                                            });

                                            setTeamDialogOpen(true);
                                        }}
                                        className="
                group relative overflow-hidden
                rounded-[26px]
                border border-white/8
                bg-[#0B1220]/90
                p-5
                text-left
                backdrop-blur-xl
                transition-all duration-300
                hover:-translate-y-1
                hover:border-yellow-400/20
                hover:bg-[#111827]
            "
                                    >
                                        {/* TOP */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="
                            flex h-10 w-10 items-center justify-center
                            rounded-2xl
                            bg-linear-to-br
                            from-yellow-400/20
                            to-orange-500/20
                            text-2xl font-black
                            text-yellow-300
                        "
                                                >
                                                    <Avatar className="h-10 w-10 rounded-xl border border-white/10">
                                                        <AvatarImage
                                                            src={
                                                                team?.profileImage
                                                            }
                                                        />
                                                    </Avatar>
                                                </div>

                                                <div>
                                                    <h2 className="max-w-[170px] truncate text-xl font-black tracking-tight text-white">
                                                        {team.name}
                                                    </h2>

                                                    <p className="mt-1 text-xs text-white/40">
                                                        Franchise Team
                                                    </p>
                                                </div>
                                            </div>

                                            <ChevronRight
                                                className="
                        h-5 w-5 text-white/20
                        transition-all duration-300
                        group-hover:translate-x-1
                        group-hover:text-yellow-300
                    "
                                            />
                                        </div>

                                        {/* OWNER */}
                                        <div
                                            className="
                    mt-5 flex items-center justify-between
                    rounded-2xl
                    border border-white/6
                    bg-white/[0.03]
                    px-3 py-3
                "
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 rounded-xl border border-white/10">
                                                    <AvatarImage
                                                        src={
                                                            owner?.profileImage
                                                        }
                                                    />
                                                </Avatar>

                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-white/30">
                                                        Owner
                                                    </p>

                                                    <h3 className="max-w-[120px] truncate text-sm font-bold text-white">
                                                        {owner?.name ||
                                                            "No Owner"}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div
                                                className="
                        flex h-9 w-9 items-center justify-center
                        rounded-xl
                        bg-yellow-400/10
                    "
                                            >
                                                <Crown className="h-4 w-4 text-yellow-300" />
                                            </div>
                                        </div>

                                        {/* STATS */}
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div
                                                className="
                        rounded-2xl
                        border border-white/6
                        bg-white/[0.03]
                        p-3
                    "
                                            >
                                                <div className="flex items-center gap-2 text-white/35">
                                                    <Users className="h-3.5 w-3.5" />

                                                    <span className="text-[10px] uppercase tracking-wider">
                                                        Players
                                                    </span>
                                                </div>

                                                <h3 className="mt-2 text-2xl font-black text-white">
                                                    {players.length}
                                                </h3>
                                            </div>

                                            <div
                                                className="
                        rounded-2xl
                        border border-yellow-400/10
                        bg-yellow-400/[0.04]
                        p-3
                    "
                                            >
                                                <div className="flex items-center gap-2 text-yellow-200/50">
                                                    <IndianRupee className="h-3.5 w-3.5" />

                                                    <span className="text-[10px] uppercase tracking-wider">
                                                        Spent
                                                    </span>
                                                </div>

                                                <h3 className="mt-2 text-2xl font-black text-yellow-300">
                                                    {spent}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* BOTTOM LINE */}
                                        <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs font-medium text-white/35">
                                                View Squad
                                            </span>

                                            <Badge className="border-white/10 bg-white/4 text-white">
                                                {players.length} Squad
                                            </Badge>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* NO RESULTS */}
                        {filteredTeams.length ===
                            0 && (
                                <div className="mt-16 flex flex-col items-center justify-center rounded-[30px] border border-white/10 bg-[#0B1220] py-24 text-center">
                                    <Search className="h-12 w-12 text-white/20" />

                                    <h3 className="mt-5 text-3xl font-black text-white">
                                        No Teams Found
                                    </h3>

                                    <p className="mt-2 text-white/50">
                                        Try searching with a
                                        different keyword.
                                    </p>
                                </div>
                            )}
                    </>
                )}
            </div>

            {/* TEAM DETAILS DIALOG */}
            <Dialog
                open={teamDialogOpen}
                onOpenChange={setTeamDialogOpen}
            >
                <DialogContent className="w-[95vw] md:h-[92vh] max-w-6xl overflow-hidden border border-white/10 bg-[#07111F] p-0 text-white sm:max-w-6xl">
                    {/* HEADER */}
                    <div className="border-b border-white/10 bg-[#0B1220] p-4 sm:p-8 shrink-0">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 sm:h-24 sm:w-24 border border-white/10 rounded-3xl">
                                    <AvatarImage
                                        src={selectedTeam?.profileImage}
                                    />
                                </Avatar>

                                <div>
                                    <h2 className="text-2xl sm:text-5xl font-black tracking-tight">
                                        {selectedTeam?.name}
                                    </h2>

                                    <div className="mt-3 flex flex-wrap gap-2">

                                        <Badge className="border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                                            <Crown className="mr-1 h-3 w-3" />
                                            {selectedTeam?.owner?.name}
                                        </Badge>

                                        <Badge className="border-green-500/20 bg-green-500/10 text-green-300">
                                            {selectedTeam?.owner
                                                ?.boughtPlayers?.length || 0}{" "}
                                            Players
                                        </Badge>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* PLAYERS */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

                            {selectedTeam?.owner?.boughtPlayers?.map(
                                (player: any) => (
                                    <div
                                        key={player._id}
                                        className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]"
                                    >
                                        {/* IMAGE */}
                                        <div className="relative">
                                            <img
                                                src={player.profileImage}
                                                alt={player.name}
                                                className="w-full h-48 sm:h-64 object-cover"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                            <div className="absolute bottom-3 left-3">
                                                <h3 className="text-lg sm:text-2xl font-black text-white">
                                                    {player.name}
                                                </h3>

                                                <p className="text-xs sm:text-sm text-yellow-300">
                                                    {player.playingRole}
                                                </p>
                                            </div>
                                        </div>

                                        {/* DETAILS */}
                                        <div className="space-y-3 p-4">

                                            <div className="grid grid-cols-2 gap-3">

                                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                                    <p className="text-xs uppercase text-white/40">
                                                        Base
                                                    </p>

                                                    <h4 className="mt-2 text-lg sm:text-xl font-bold text-white">
                                                        ₹{player.basePrice || 0}
                                                    </h4>
                                                </div>

                                                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3">
                                                    <p className="text-xs uppercase text-green-200/70">
                                                        Bought
                                                    </p>

                                                    <h4 className="mt-2 text-lg sm:text-xl font-bold text-green-300">
                                                        ₹
                                                        {player.purchasePrice ||
                                                            player.soldPrice ||
                                                            0}
                                                    </h4>
                                                </div>

                                            </div>

                                            <div className="flex items-center justify-between flex-wrap gap-2">

                                                <Badge className="border-white/10 bg-white/5 text-white">
                                                    {player.role}
                                                </Badge>

                                                <span className="text-xs sm:text-sm text-white/40">
                                                    {player.village}
                                                </span>

                                            </div>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>

                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}