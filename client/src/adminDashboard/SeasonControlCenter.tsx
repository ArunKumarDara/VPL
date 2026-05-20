// pages/admin/SeasonControlCenter.tsx

import { useEffect, useMemo, useState } from "react";

import { useParams } from "react-router-dom";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";

import {
    Trophy,
    Users,
    Shield,
    Gavel,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    IndianRupee,
    Crown,
    Loader2,
    Timer,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { getSeasonById } from "@/services/seasons/seasonsService";
import { buyPlayer } from "@/services/owner/ownerService";

const ITEMS_PER_PAGE = 8;

export default function SeasonControlCenter() {
    const { seasonId } = useParams();
    const queryClient = useQueryClient();

    const [ownerPurses, setOwnerPurses] = useState<
        Record<string, number>
    >({});

    const [activeTab, setActiveTab] = useState<
        "owners" | "players"
    >("owners");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [auctionStarted, setAuctionStarted] =
        useState(false);

    const [auctionIndex, setAuctionIndex] =
        useState(0);

    const [currentBid, setCurrentBid] =
        useState(0);

    const [soldTo, setSoldTo] =
        useState("");

    const [auctionTimer, setAuctionTimer] =
        useState(180);

    const [selectedOwnerId, setSelectedOwnerId] =
        useState("");

    const [soldModalOpen, setSoldModalOpen] =
        useState(false);

    const [soldData, setSoldData] =
        useState<any>(null);

    const [teamDialogOpen, setTeamDialogOpen] =
        useState(false);

    const [selectedOwner, setSelectedOwner] =
        useState<any>(null);

    const {
        data: season,
        isLoading,
    } = useQuery({
        queryKey: ["season", seasonId],
        queryFn: () =>
            getSeasonById(seasonId as string),
        enabled: !!seasonId,
    });

    // ALL REGISTERED PLAYERS -> FOR PLAYERS TAB
    const allPlayers =
        season?.registeredPlayers || [];

    // ONLY UNSOLD PLAYERS -> FOR AUCTION
    const auctionPlayers = allPlayers.filter(
        (player: any) =>
            player.soldStatus === "UNSOLD",
    );

    const owners = season?.owners || [];

    // CURRENT AUCTION PLAYER
    const currentAuctionPlayer =
        auctionPlayers?.[auctionIndex];

    const paginatedData = useMemo(() => {
        const start =
            (currentPage - 1) *
            ITEMS_PER_PAGE;

        if (activeTab === "owners") {
            return owners.slice(
                start,
                start + ITEMS_PER_PAGE,
            );
        }

        return allPlayers.slice(
            start,
            start + ITEMS_PER_PAGE,
        );
    }, [
        activeTab,
        currentPage,
        owners,
        allPlayers,
    ]);

    const totalPages = Math.ceil(
        (activeTab === "owners"
            ? owners.length
            : allPlayers.length) /
        ITEMS_PER_PAGE,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    useEffect(() => {
        if (!owners?.length) return;

        const purseData: Record<string, number> = {};

        owners.forEach((owner: any) => {
            purseData[owner._id] =
                owner.remainingPurse || 0;
        });

        setOwnerPurses(purseData);
    }, [owners]);

    useEffect(() => {
        if (!auctionStarted) return;

        if (auctionTimer <= 0) return;

        const interval = setInterval(() => {
            setAuctionTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [auctionStarted, auctionTimer]);

    const goToNextPlayer = () => {
        if (auctionIndex < auctionPlayers.length - 1) {
            const nextIndex = auctionIndex + 1;

            setAuctionIndex(nextIndex);

            setAuctionTimer(180);

            setSoldTo("");

            setSelectedOwnerId("");

            setCurrentBid(
                auctionPlayers[nextIndex]?.basePrice || 0,
            );
        }
    };

    const buyPlayerMutation = useMutation({
        mutationFn: ({
            ownerId,
            playerId,
            amount,
        }: {
            ownerId: string;
            playerId: string;
            amount: number;
        }) =>
            buyPlayer(
                ownerId,
                playerId,
                amount,
            ),

        onSuccess: (data, variables) => {
            const owner = owners.find(
                (o: any) =>
                    o._id === variables.ownerId,
            );

            setSoldData({
                ownerName: owner?.name,
                teamName:
                    owner?.team?.name ||
                    "No Team",
                playerName:
                    currentAuctionPlayer?.name,
                amount: currentBid,
            });

            setSoldModalOpen(true);
            setSoldTo("");
            setSelectedOwnerId("");
            setOwnerPurses((prev) => ({
                ...prev,
                [variables.ownerId]:
                    data?.remainingPurse ??
                    prev[variables.ownerId],
            }));

            queryClient.invalidateQueries({
                queryKey: ["season", seasonId],
            });

            toast.success(
                "Player sold successfully",
            );
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data
                    ?.message ||
                "Failed to buy player",
            );
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#060816] text-white">
                <Navbar />

                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />

                        <p className="mt-5 text-lg text-white/70">
                            Loading season...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-hidden bg-[#060816] text-white">
            <Navbar />

            {/* BACKGROUND */}

            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-0 top-0 h-100 w-100 rounded-full bg-yellow-500/10 blur-[140px]" />

                <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-orange-500/10 blur-[140px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-28">
                {/* HERO */}

                <div className="relative overflow-hidden rounded-[32px] border border-yellow-400/10 bg-[#0d1326]">
                    <div className="absolute inset-0 bg-linear-to-br from-yellow-400/5 via-transparent to-orange-500/5" />

                    <div className="relative z-10 p-8 md:p-10">
                        <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <Badge className="border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-yellow-300">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    ADMIN DASHBOARD
                                </Badge>

                                <h1 className="mt-6 text-5xl font-black leading-tight text-white">
                                    {season?.title}
                                </h1>

                                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/60">
                                    Premium cricket auction
                                    management dashboard with
                                    owners, players and live
                                    auction controls.
                                </p>
                            </div>

                            {/* STATS */}

                            <div className="grid grid-cols-3 gap-4">
                                <Card className="border border-white/10 bg-[#111827]">
                                    <CardContent className="p-5 text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10">
                                            <Trophy className="text-yellow-300" />
                                        </div>

                                        <h2 className="mt-4 text-4xl font-black text-white">
                                            {season?.teams
                                                ?.length ||
                                                0}
                                        </h2>

                                        <p className="mt-1 text-sm text-white/50">
                                            Teams
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border border-white/10 bg-[#111827]">
                                    <CardContent className="p-5 text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10">
                                            <Users className="text-yellow-300" />
                                        </div>

                                        <h2 className="mt-4 text-4xl font-black text-white">
                                            {
                                                allPlayers.length
                                            }
                                        </h2>

                                        <p className="mt-1 text-sm text-white/50">
                                            Players
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border border-white/10 bg-[#111827]">
                                    <CardContent className="p-5 text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10">
                                            <Shield className="text-yellow-300" />
                                        </div>

                                        <h2 className="mt-4 text-4xl font-black text-white">
                                            {
                                                owners.length
                                            }
                                        </h2>

                                        <p className="mt-1 text-sm text-white/50">
                                            Owners
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS */}

                <div className="mt-10 flex gap-4">
                    <Button
                        onClick={() =>
                            setActiveTab(
                                "owners",
                            )
                        }
                        className={`h-12 rounded-2xl px-8 font-bold transition-all
                        ${activeTab ===
                                "owners"
                                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                                : "border border-white/10 bg-[#111827] text-white hover:bg-[#1b2336]"
                            }`}
                    >
                        Owners & Teams
                    </Button>

                    <Button
                        onClick={() =>
                            setActiveTab(
                                "players",
                            )
                        }
                        className={`h-12 rounded-2xl px-8 font-bold transition-all
                        ${activeTab ===
                                "players"
                                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                                : "border border-white/10 bg-[#111827] text-white hover:bg-[#1b2336]"
                            }`}
                    >
                        Players
                    </Button>
                </div>

                {/* TABLE */}

                <Card className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1326]">
                    <CardContent className="p-0">
                        <div className="border-b border-white/10 px-8 py-6">
                            <h2 className="text-3xl font-black text-white">
                                {activeTab ===
                                    "owners"
                                    ? "Owners & Teams"
                                    : "Registered Players"}
                            </h2>

                            <p className="mt-2 text-white/50">
                                Manage all season{" "}
                                {activeTab}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="h-16 pl-8 text-sm font-bold text-yellow-300">
                                            Name
                                        </TableHead>

                                        {activeTab ===
                                            "owners" ? (
                                            <>
                                                <TableHead className="text-sm font-bold text-yellow-300">
                                                    Team
                                                </TableHead>

                                                <TableHead className="text-sm font-bold text-yellow-300">
                                                    Village
                                                </TableHead>

                                                <TableHead className="text-sm font-bold text-yellow-300">
                                                    Mobile
                                                </TableHead>
                                            </>
                                        ) : (
                                            <>
                                                <TableHead className="text-sm font-bold text-yellow-300">
                                                    Role
                                                </TableHead>

                                                <TableHead className="text-sm font-bold text-yellow-300">
                                                    Base Price
                                                </TableHead>

                                                <TableHead className="text-sm font-bold text-yellow-300">
                                                    Status
                                                </TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {activeTab ===
                                        "owners"
                                        ? paginatedData.map(
                                            (
                                                owner: any,
                                            ) => (
                                                <TableRow
                                                    onClick={() => {
                                                        setSelectedOwner(owner);
                                                        setTeamDialogOpen(true);
                                                    }}
                                                    key={
                                                        owner._id
                                                    }
                                                    className="border-white/5 hover:bg-white/5"
                                                >
                                                    <TableCell className="py-5 pl-8">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-14 w-14 rounded-2xl">
                                                                <AvatarImage
                                                                    src={
                                                                        owner.profileImage
                                                                    }
                                                                />
                                                            </Avatar>

                                                            <div>
                                                                <h3 className="font-bold text-white">
                                                                    {
                                                                        owner.name
                                                                    }
                                                                </h3>

                                                                <p className="text-sm text-white/50">
                                                                    Franchise
                                                                    Owner
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="font-semibold text-white">
                                                        {owner
                                                            ?.team
                                                            ?.name ||
                                                            "No Team"}
                                                    </TableCell>

                                                    <TableCell className="text-white/70">
                                                        {owner.village ||
                                                            "--"}
                                                    </TableCell>

                                                    <TableCell className="text-white/70">
                                                        {owner.mobile ||
                                                            "--"}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )
                                        : paginatedData.map(
                                            (
                                                player: any,
                                            ) => (
                                                <TableRow
                                                    key={
                                                        player._id
                                                    }
                                                    className="border-white/5 hover:bg-white/5"
                                                >
                                                    <TableCell className="py-5 pl-8">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-14 w-14 rounded-2xl">
                                                                <AvatarImage
                                                                    src={
                                                                        player.profileImage
                                                                    }
                                                                />
                                                            </Avatar>

                                                            <div>
                                                                <h3 className="font-bold text-white">
                                                                    {
                                                                        player.name
                                                                    }
                                                                </h3>

                                                                <p className="text-sm text-white/50">
                                                                    Registered
                                                                    Player
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="font-semibold text-white">
                                                        {
                                                            player.role
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center font-black text-yellow-300">
                                                            <IndianRupee className="mr-1 h-4 w-4" />

                                                            {player.basePrice ||
                                                                0}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge className="border-green-500/20 bg-green-500/10 text-green-300">
                                                            Active
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* PAGINATION */}

                        <div className="flex items-center justify-between border-t border-white/10 px-8 py-5">
                            <p className="text-sm text-white/50">
                                Page{" "}
                                {currentPage} of{" "}
                                {totalPages}
                            </p>

                            <div className="flex gap-3">
                                <Button
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
                                    className="h-11 rounded-xl border border-white/10 bg-[#111827] text-white hover:bg-[#1b2336]"
                                >
                                    <ChevronLeft className="mr-1 h-4 w-4" />

                                    Prev
                                </Button>

                                <Button
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
                                    className="h-11 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300"
                                >
                                    Next

                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* LIVE AUCTION */}

                <div className="mt-12 grid gap-8 xl:grid-cols-[1fr_380px]">
                    {/* PLAYER */}

                    <Card className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0d1326]">
                        <CardContent className="p-8">
                            {!auctionStarted ? (
                                <div className="flex min-h-112.5 flex-col items-center justify-center text-center">
                                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-yellow-400/10">
                                        <Gavel className="h-14 w-14 text-yellow-300" />
                                    </div>

                                    <h2 className="mt-8 text-5xl font-black text-white">
                                        Live Auction
                                    </h2>

                                    <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
                                        Start live player auction
                                        with premium admin controls.
                                    </p>

                                    <Button
                                        onClick={() => {
                                            setAuctionStarted(true);

                                            setCurrentBid(
                                                currentAuctionPlayer?.basePrice || 0,
                                            );
                                        }}
                                        className="mt-10 h-14 rounded-2xl bg-yellow-400 px-10 text-lg font-black text-black hover:bg-yellow-300"
                                    >
                                        Start Auction
                                    </Button>
                                </div>
                            ) : !currentAuctionPlayer ? (
                                <div className="flex min-h-112.5 flex-col items-center justify-center text-center">
                                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-red-500/10">
                                        <Gavel className="h-14 w-14 text-red-400" />
                                    </div>

                                    <h2 className="mt-8 text-4xl font-black text-white">
                                        No Players Available
                                    </h2>

                                    <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
                                        There are no players available for auction.
                                        Make sure to register more players for this season.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-8 lg:flex-row">
                                    <img
                                        src={
                                            currentAuctionPlayer?.profileImage
                                        }
                                        alt={
                                            currentAuctionPlayer?.name
                                        }
                                        className="h-80 w-full rounded-[30px] border border-yellow-400/20 object-cover lg:w-[340px]"
                                    />

                                    <div className="flex-1">
                                        <Badge className="border-green-500/20 bg-green-500/10 text-green-300">
                                            LIVE AUCTION
                                        </Badge>

                                        <div className="flex flex-row items-center gap-7">
                                            <h1 className="mt-3 text-4xl font-black text-white">
                                                {
                                                    currentAuctionPlayer?.name
                                                }
                                            </h1>

                                            <p className="mt-5 text-md text-yellow-300">
                                                {
                                                    currentAuctionPlayer?.playingRole
                                                }
                                            </p>
                                        </div>

                                        <div className="mt-5 grid gap-5 md:grid-cols-3">
                                            <div className="rounded-3xl border border-white/10 bg-[#111827] p-5">
                                                <p className="text-sm text-white/50">
                                                    Base Price
                                                </p>

                                                <div className="mt-3 flex items-center text-3xl font-black text-yellow-300">
                                                    <IndianRupee className="mr-1 h-7 w-7" />

                                                    {
                                                        currentAuctionPlayer?.basePrice
                                                    }
                                                </div>
                                            </div>

                                            <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5">
                                                <p className="text-sm text-green-200/70">
                                                    Current Bid
                                                </p>

                                                <div className="mt-3 flex items-center text-3xl font-black text-green-300">
                                                    <IndianRupee className="mr-1 h-7 w-7" />

                                                    {
                                                        currentBid
                                                    }
                                                </div>
                                            </div>

                                            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
                                                <p className="text-sm text-red-200/70">
                                                    Timer
                                                </p>

                                                <div className="mt-3 flex items-center text-3xl font-black text-red-300">
                                                    <Timer className="mr-2 h-7 w-7" />

                                                    {
                                                        auctionTimer
                                                    }
                                                    s
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/20">
                                                    <Crown className="text-yellow-300" />
                                                </div>

                                                <div>
                                                    <p className="text-sm text-white/50">
                                                        Highest Bidder
                                                    </p>

                                                    <h3 className="mt-1 text-3xl font-black text-white">
                                                        {soldTo ||
                                                            "Waiting for bids"}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-2 space-y-3">
                                            {/* FIRST ROW */}

                                            <div className="grid grid-cols-2 gap-3">
                                                <Button
                                                    onClick={() => {
                                                        if (!selectedOwnerId) {
                                                            toast.error(
                                                                "Please select bidder",
                                                            );

                                                            return;
                                                        }

                                                        buyPlayerMutation.mutate({
                                                            ownerId:
                                                                selectedOwnerId,
                                                            playerId:
                                                                currentAuctionPlayer?._id,
                                                            amount:
                                                                currentBid,
                                                        });
                                                    }}
                                                    disabled={
                                                        buyPlayerMutation.isPending
                                                    }
                                                    className="
                                h-12 w-full rounded-xl
                                bg-green-500
                                text-sm font-black
                                hover:bg-green-600
                                "
                                                >
                                                    {buyPlayerMutation.isPending ? (
                                                        <Loader2 className="animate-spin" />
                                                    ) : (
                                                        `SOLD TO ${soldTo || "OWNER"
                                                        }`
                                                    )}
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    className="
                                h-12 w-full rounded-xl
                                border-white/10
                                bg-[#111827]
                                text-sm font-bold text-white
                                hover:bg-[#1b2336]
                                "
                                                >
                                                    UNSOLD
                                                </Button>
                                            </div>

                                            {/* SECOND ROW */}

                                            <Button
                                                onClick={goToNextPlayer}
                                                className="
                            h-12 w-full rounded-xl
                            bg-yellow-400
                            text-sm font-black text-black
                            hover:bg-yellow-300
                            "
                                            >
                                                NEXT PLAYER
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <div
                        className="
    flex h-full flex-col
    bg-[#0d1326]
    p-5
    "
                    >
                        {/* HEADER */}

                        <div>
                            <h2 className="text-2xl font-black text-white">
                                Auction Controls
                            </h2>

                            <p className="mt-1 text-sm text-white/50">
                                Live bidding panel
                            </p>
                        </div>

                        <div className="mt-5 flex-1 overflow-y-auto pr-1">
                            <div className="space-y-3">
                                {owners.map((owner: any) => (
                                    <Button
                                        key={owner._id}
                                        onClick={() => {
                                            const ownerPurse =
                                                ownerPurses[owner._id] || 0;

                                            // FIRST BID
                                            const bidAmount = !soldTo
                                                ? currentAuctionPlayer?.basePrice || 0
                                                : currentBid + 100;

                                            // CHECK PURSE
                                            if (ownerPurse < bidAmount) {
                                                toast.error(
                                                    `${owner.name} doesn't have enough purse`,
                                                );

                                                return;
                                            }

                                            setSelectedOwnerId(owner._id);

                                            setCurrentBid(bidAmount);

                                            setSoldTo(owner.name);

                                            setAuctionTimer(180);
                                        }}
                                        className="
            h-18 w-full
            justify-between
            rounded-2xl
            border border-white/10
            bg-[#111827]
            px-4
            text-white
            transition-all duration-300
            hover:bg-yellow-400
            hover:text-black
        "
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-black">
                                                {owner.name}
                                            </span>

                                            <span className="text-xs opacity-70">
                                                Remaining Purse
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <span className="text-lg font-black text-yellow-300">
                                                ₹{ownerPurses[owner._id] || 0}
                                            </span>

                                            <span className="text-xs font-bold">
                                                {!soldTo
                                                    ? `₹${currentAuctionPlayer?.basePrice || 0}`
                                                    : `+₹100`}
                                            </span>
                                        </div>
                                    </Button>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                open={teamDialogOpen}
                onOpenChange={setTeamDialogOpen}
            >
                <DialogContent className="max-h-[90vh] overflow-hidden border border-yellow-400/20 bg-[#07111F] p-0 text-white sm:max-w-4xl">
                    {/* HEADER */}
                    <div className="relative overflow-hidden border-b border-white/10 p-8">
                        <div className="absolute inset-0 bg-linear-to-r from-yellow-400/10 via-transparent to-orange-500/10" />

                        <div className="relative z-10 flex items-center gap-5">
                            <Avatar className="h-22 w-22 rounded-3xl border border-yellow-400/20">
                                <AvatarImage
                                    src={selectedOwner?.profileImage}
                                />
                            </Avatar>

                            <div>
                                <h2 className="text-4xl font-black text-white">
                                    {selectedOwner?.name}
                                </h2>

                                <p className="mt-2 text-white/60">
                                    {
                                        selectedOwner?.team?.name
                                    }
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    <Badge className="border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                                        Team Squad
                                    </Badge>

                                    <Badge className="border-green-500/20 bg-green-500/10 text-green-300">
                                        ₹
                                        {ownerPurses[
                                            selectedOwner?._id
                                        ] || 0}{" "}
                                        Purse Left
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PLAYERS */}
                    <div className="max-h-[65vh] overflow-y-auto p-6">
                        {!selectedOwner?.boughtPlayers ||
                            selectedOwner.boughtPlayers.length ===
                            0 ? (
                            <div className="flex min-h-80 flex-col items-center justify-center text-center">
                                <Users className="h-14 w-14 text-white/20" />

                                <h3 className="mt-5 text-2xl font-black text-white">
                                    No Players Purchased
                                </h3>

                                <p className="mt-2 text-white/50">
                                    This owner has not purchased
                                    any players yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-3">
                                {selectedOwner.boughtPlayers.map(
                                    (player: any) => (
                                        <div
                                            key={player._id}
                                            className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1326] transition-all duration-300 hover:border-yellow-400/20 hover:bg-[#111827]"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={
                                                        player.profileImage
                                                    }
                                                    alt={player.name}
                                                    className="h-52 w-full object-cover"
                                                />

                                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

                                                <Badge className="absolute right-4 top-4 border-green-500/20 bg-green-500/10 text-green-300">
                                                    SOLD
                                                </Badge>

                                                <div className="absolute bottom-4 left-4">
                                                    <h3 className="text-2xl font-black text-white">
                                                        {player.name}
                                                    </h3>

                                                    <p className="text-sm text-yellow-300">
                                                        {
                                                            player.playingRole
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="rounded-2xl border border-white/10 bg-[#111827] p-4">
                                                        <p className="text-xs text-white/50">
                                                            Base Price
                                                        </p>

                                                        <div className="mt-2 flex items-center text-xl font-black text-yellow-300">
                                                            <IndianRupee className="mr-1 h-4 w-4" />

                                                            {player.basePrice ||
                                                                0}
                                                        </div>
                                                    </div>

                                                    <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                                                        <p className="text-xs text-green-200/70">
                                                            Purchased Price
                                                        </p>

                                                        <div className="mt-2 flex items-center text-xl font-black text-green-300">
                                                            <IndianRupee className="mr-1 h-4 w-4" />

                                                            {player.purchasePrice ||
                                                                player.soldPrice ||
                                                                0}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <Badge className="border-white/10 bg-white/5 text-white">
                                                        {player.role}
                                                    </Badge>

                                                    <span className="text-sm font-bold text-white/60">
                                                        {
                                                            player.village
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={soldModalOpen}
                onOpenChange={setSoldModalOpen}
            >
                <DialogContent className="border border-yellow-400/20 bg-[#07111F] text-white sm:max-w-md">
                    <div className="py-6 text-center">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
                            <Shield className="h-12 w-12 text-green-400" />
                        </div>

                        <h2 className="mt-6 text-4xl font-black text-white">
                            SOLD
                        </h2>

                        <p className="mt-3 text-white/60">
                            Player sold successfully
                        </p>

                        <div className="mt-8 rounded-3xl border border-white/10 bg-[#111827] p-6 text-left">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-white/50">
                                        Player
                                    </p>

                                    <h3 className="text-2xl font-black">
                                        {
                                            soldData?.playerName
                                        }
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-sm text-white/50">
                                        Owner
                                    </p>

                                    <h3 className="text-xl font-bold text-yellow-300">
                                        {
                                            soldData?.ownerName
                                        }
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-sm text-white/50">
                                        Team
                                    </p>

                                    <h3 className="text-xl font-bold">
                                        {
                                            soldData?.teamName
                                        }
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-sm text-white/50">
                                        Sold Amount
                                    </p>

                                    <h3 className="text-3xl font-black text-green-400">
                                        ₹
                                        {
                                            soldData?.amount
                                        }
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                setSoldModalOpen(false);
                                if (
                                    auctionIndex <
                                    auctionPlayers.length - 1
                                ) {
                                    setAuctionIndex(
                                        (prev) => prev + 1,
                                    );

                                    setAuctionTimer(180);

                                    setCurrentBid(
                                        auctionPlayers[
                                            auctionIndex + 1
                                        ]?.basePrice || 0,
                                    );
                                }
                            }}

                            className="mt-8 h-12 w-full rounded-2xl bg-yellow-400 font-black text-black hover:bg-yellow-300"
                        >
                            CLOSE
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}