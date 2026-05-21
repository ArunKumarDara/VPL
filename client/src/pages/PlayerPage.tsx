// pages/PlayersPage.tsx

import {
    useMemo,
    useState,
    useEffect,
} from "react";

import Navbar from "@/components/Navbar";

import { useQuery } from "@tanstack/react-query";

import {
    Trophy,
    Search,
    IndianRupee,
    ShieldAlert,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    getAllSeasons,
    getSeasonById,
} from "@/services/seasons/seasonsService";

const ITEMS_PER_PAGE = 12;

export default function PlayersPage() {
    const [selectedSeasonId, setSelectedSeasonId] =
        useState("");

    const [selectedTeam, setSelectedTeam] =
        useState("ALL");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    // ALL SEASONS
    const { data: seasonsData } = useQuery({
        queryKey: ["all-seasons"],
        queryFn: getAllSeasons,
    });

    // SELECTED SEASON
    const { data: season } = useQuery({
        queryKey: [
            "season-details",
            selectedSeasonId,
        ],
        queryFn: () =>
            getSeasonById(
                selectedSeasonId,
            ),
        enabled: !!selectedSeasonId,
    });

    const players =
        season?.registeredPlayers || [];

    const teams = season?.teams || [];

    // RESET PAGE
    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        selectedTeam,
        statusFilter,
    ]);

    // FILTER PLAYERS
    const filteredPlayers = useMemo(() => {
        return players.filter((player: any) => {
            // SEARCH
            const searchMatch =
                player?.name
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase(),
                    );

            // TEAM
            const teamMatch =
                selectedTeam === "ALL"
                    ? true
                    : player?.currentTeam
                        ?._id ===
                    selectedTeam;

            // STATUS
            const statusMatch =
                statusFilter === "ALL"
                    ? true
                    : player?.soldStatus ===
                    statusFilter;

            return (
                searchMatch &&
                teamMatch &&
                statusMatch
            );
        });
    }, [
        players,
        search,
        selectedTeam,
        statusFilter,
    ]);

    // PAGINATION
    const totalPages = Math.ceil(
        filteredPlayers.length /
        ITEMS_PER_PAGE,
    );

    const paginatedPlayers =
        filteredPlayers.slice(
            (currentPage - 1) *
            ITEMS_PER_PAGE,
            currentPage *
            ITEMS_PER_PAGE,
        );

    return (
        <div className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            {/* BG */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-yellow-500/10 blur-[120px]" />

                <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[120px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-28">
                {/* HERO */}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <Badge className="border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-yellow-300">
                            <Trophy className="mr-2 h-4 w-4" />
                            PLAYER AUCTION HUB
                        </Badge>

                        <h1 className="mt-6 text-5xl font-black tracking-tight text-white">
                            Players
                        </h1>

                        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/50">
                            Explore all sold and
                            unsold auction players
                            season wise.
                        </p>
                    </div>

                    {/* FILTERS */}
                    <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row">
                        {/* SEARCH */}
                        <div className="relative w-full lg:w-[280px]">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                            <Input
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target
                                            .value,
                                    )
                                }
                                placeholder="Search players..."
                                className="h-13 rounded-2xl border-white/10 bg-[#0B1220] pl-11 text-white placeholder:text-white/30 focus-visible:ring-yellow-400"
                            />
                        </div>

                        {/* SEASON */}
                        <Select
                            value={
                                selectedSeasonId
                            }
                            onValueChange={(
                                value,
                            ) => {
                                setSelectedSeasonId(
                                    value,
                                );

                                setSelectedTeam(
                                    "ALL",
                                );

                                setStatusFilter(
                                    "ALL",
                                );
                            }}
                        >
                            <SelectTrigger className="h-13 w-full rounded-2xl border-white/10 bg-[#0B1220] text-white lg:w-[240px]">
                                <SelectValue placeholder="Select Season" />
                            </SelectTrigger>

                            <SelectContent className="border-white/10 bg-[#0B1220] text-white">
                                {seasonsData?.map(
                                    (
                                        season: any,
                                    ) => (
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

                        {/* TEAM */}
                        <Select
                            value={selectedTeam}
                            onValueChange={
                                setSelectedTeam
                            }
                            disabled={
                                !selectedSeasonId
                            }
                        >
                            <SelectTrigger className="h-13 w-full rounded-2xl border-white/10 bg-[#0B1220] text-white lg:w-[220px]">
                                <SelectValue placeholder="Select Team" />
                            </SelectTrigger>

                            <SelectContent className="border-white/10 bg-[#0B1220] text-white">
                                <SelectItem value="ALL">
                                    All Teams
                                </SelectItem>

                                {teams.map(
                                    (team: any) => (
                                        <SelectItem
                                            key={
                                                team._id
                                            }
                                            value={
                                                team._id
                                            }
                                        >
                                            {
                                                team.name
                                            }
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        {/* STATUS */}
                        <Select
                            value={statusFilter}
                            onValueChange={
                                setStatusFilter
                            }
                        >
                            <SelectTrigger className="h-13 w-full rounded-2xl border-white/10 bg-[#0B1220] text-white lg:w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent className="border-white/10 bg-[#0B1220] text-white">
                                <SelectItem value="ALL">
                                    All Players
                                </SelectItem>

                                <SelectItem value="SOLD">
                                    Sold
                                </SelectItem>

                                <SelectItem value="UNSOLD">
                                    Unsold
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* EMPTY */}
                {!selectedSeasonId ? (
                    <div className="mt-16 flex min-h-[450px] flex-col items-center justify-center rounded-[36px] border border-dashed border-white/10 bg-[#0B1220]/70 text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400/10">
                            <Trophy className="h-12 w-12 text-yellow-300" />
                        </div>

                        <h2 className="mt-8 text-4xl font-black">
                            Select a Season
                        </h2>

                        <p className="mt-3 text-white/50">
                            Choose a season to
                            view players.
                        </p>
                    </div>
                ) : (
                    <Card className="mt-12 overflow-hidden rounded-[30px] border border-white/10 bg-[#0B1220]">
                        <CardContent className="p-0">
                            {/* HEADER */}
                            <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
                                <div>
                                    <h2 className="text-3xl font-black text-white">
                                        Auction Players
                                    </h2>

                                    <p className="mt-1 text-sm text-white/40">
                                        {
                                            filteredPlayers.length
                                        }{" "}
                                        Players
                                        Found
                                    </p>
                                </div>

                                <Badge className="border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                                    {
                                        season?.title
                                    }
                                </Badge>
                            </div>

                            {/* TABLE */}
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableHead className="h-16 pl-8 text-yellow-300">
                                                Player
                                            </TableHead>

                                            <TableHead className="text-yellow-300">
                                                Role
                                            </TableHead>
                                            <TableHead className="text-yellow-300">
                                                Phone Number
                                            </TableHead>

                                            <TableHead className="text-yellow-300">
                                                Team
                                            </TableHead>

                                            <TableHead className="text-yellow-300">
                                                Base
                                            </TableHead>

                                            <TableHead className="text-yellow-300">
                                                Sold
                                            </TableHead>

                                            <TableHead className="text-yellow-300">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {paginatedPlayers.map(
                                            (
                                                player: any,
                                            ) => (
                                                <TableRow
                                                    key={
                                                        player._id
                                                    }
                                                    className="border-white/5 hover:bg-white/[0.03]"
                                                >
                                                    {/* PLAYER */}
                                                    <TableCell className="py-5 pl-8">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-14 w-14 rounded-2xl border border-white/10">
                                                                <AvatarImage
                                                                    src={
                                                                        player.profileImage
                                                                    }
                                                                />
                                                            </Avatar>

                                                            <div>
                                                                <h3 className="text-lg font-black text-white">
                                                                    {
                                                                        player.name
                                                                    }
                                                                </h3>

                                                                <p className="text-sm text-white/40">
                                                                    {
                                                                        player.village
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* ROLE */}
                                                    <TableCell>
                                                        <Badge className="border-white/10 bg-white/[0.04] text-white">
                                                            {
                                                                player.playingRole ||
                                                                player.role
                                                            }
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-bold text-white">{player.mobile}</div>
                                                    </TableCell>

                                                    {/* TEAM */}
                                                    <TableCell>
                                                        {player
                                                            ?.currentTeam
                                                            ?.name ? (
                                                            <div className="font-bold text-white">
                                                                {
                                                                    player
                                                                        ?.currentTeam
                                                                        ?.name
                                                                }
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-red-300">
                                                                <ShieldAlert className="h-4 w-4" />
                                                                Unsold
                                                            </div>
                                                        )}
                                                    </TableCell>

                                                    {/* BASE */}
                                                    <TableCell>
                                                        <div className="flex items-center font-black text-white">
                                                            <IndianRupee className="mr-1 h-4 w-4" />

                                                            {player.basePrice ||
                                                                0}
                                                        </div>
                                                    </TableCell>

                                                    {/* SOLD */}
                                                    <TableCell>
                                                        <div className="flex items-center font-black text-yellow-300">
                                                            <IndianRupee className="mr-1 h-4 w-4" />

                                                            {player.purchasePrice ||
                                                                player.soldPrice ||
                                                                0}
                                                        </div>
                                                    </TableCell>

                                                    {/* STATUS */}
                                                    <TableCell>
                                                        {player.soldStatus ===
                                                            "SOLD" ? (
                                                            <Badge className="border-green-500/20 bg-green-500/10 text-green-300">
                                                                SOLD
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="border-red-500/20 bg-red-500/10 text-red-300">
                                                                UNSOLD
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* PAGINATION */}
                            {filteredPlayers.length >
                                0 && (
                                    <div className="flex items-center justify-between border-t border-white/10 px-6 py-5">
                                        <div className="text-sm text-white/40">
                                            Showing{" "}
                                            {(currentPage -
                                                1) *
                                                ITEMS_PER_PAGE +
                                                1}
                                            {" - "}
                                            {Math.min(
                                                currentPage *
                                                ITEMS_PER_PAGE,
                                                filteredPlayers.length,
                                            )}{" "}
                                            of{" "}
                                            {
                                                filteredPlayers.length
                                            }
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={
                                                    currentPage ===
                                                    1
                                                }
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (
                                                            prev,
                                                        ) =>
                                                            prev -
                                                            1,
                                                    )
                                                }
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111827] text-white transition hover:bg-white/10 disabled:opacity-40"
                                            >
                                                ←
                                            </button>

                                            <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
                                                {
                                                    currentPage
                                                }{" "}
                                                /{" "}
                                                {totalPages ||
                                                    1}
                                            </div>

                                            <button
                                                disabled={
                                                    currentPage ===
                                                    totalPages
                                                }
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (
                                                            prev,
                                                        ) =>
                                                            prev +
                                                            1,
                                                    )
                                                }
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111827] text-white transition hover:bg-white/10 disabled:opacity-40"
                                            >
                                                →
                                            </button>
                                        </div>
                                    </div>
                                )}

                            {/* EMPTY PLAYERS */}
                            {filteredPlayers.length ===
                                0 && (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <Search className="h-12 w-12 text-white/20" />

                                        <h3 className="mt-5 text-3xl font-black text-white">
                                            No Players
                                            Found
                                        </h3>

                                        <p className="mt-2 text-white/50">
                                            Try another
                                            search or
                                            filter.
                                        </p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}