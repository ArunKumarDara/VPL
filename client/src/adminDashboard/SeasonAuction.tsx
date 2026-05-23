import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Crown,
    Gavel,
    IndianRupee,
    Loader2,
    Search,
    Shield,
    Timer,
} from "lucide-react";

import { buyPlayer } from "@/services/owner/ownerService";
import { getSeasonById } from "@/services/seasons/seasonsService";

export default function SeasonAuctionPage() {
    const { seasonId } = useParams();
    const queryClient = useQueryClient();

    const [ownerPurses, setOwnerPurses] = useState<Record<string, number>>({});
    const [playerSearch, setPlayerSearch] = useState("");
    const [filteredAuctionPlayers, setFilteredAuctionPlayers] = useState<any[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [auctionStarted, setAuctionStarted] = useState(false);
    const [auctionIndex, setAuctionIndex] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [soldTo, setSoldTo] = useState("");
    const [auctionTimer, setAuctionTimer] = useState(180);
    const [selectedOwnerId, setSelectedOwnerId] = useState("");
    const [soldModalOpen, setSoldModalOpen] = useState(false);
    const [soldData, setSoldData] = useState<any>(null);
    const [unsoldModalOpen, setUnsoldModalOpen] = useState(false);
    const [unsoldData, setUnsoldData] = useState<any>(null);

    const { data: season, isLoading } = useQuery({
        queryKey: ["season", seasonId],
        queryFn: () => getSeasonById(seasonId as string),
        enabled: !!seasonId,
    });

    const allPlayers = season?.registeredPlayers || [];

    const auctionPlayers = allPlayers.filter(
        (player: any) => player.soldStatus === "UNSOLD",
    );

    const owners = season?.owners || [];
    const currentAuctionPlayer = auctionPlayers?.[auctionIndex];

    useEffect(() => {
        if (!playerSearch.trim()) {
            setFilteredAuctionPlayers(auctionPlayers);
            return;
        }

        const filtered = auctionPlayers.filter((player: any) =>
            player.name?.toLowerCase().includes(playerSearch.toLowerCase()),
        );

        setFilteredAuctionPlayers(filtered);
    }, [playerSearch, auctionPlayers]);

    useEffect(() => {
        if (!owners?.length) return;

        const purseData: Record<string, number> = {};

        owners.forEach((owner: any) => {
            purseData[owner._id] = owner.remainingPurse || 0;
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
            setCurrentBid(auctionPlayers[nextIndex]?.basePrice || 0);
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
        }) => buyPlayer(ownerId, playerId, amount),

        onSuccess: (data, variables) => {
            const owner = owners.find((o: any) => o._id === variables.ownerId);

            setSoldData({
                ownerName: owner?.name,
                teamName: owner?.team?.name || "No Team",
                playerName: currentAuctionPlayer?.name,
                amount: currentBid,
            });

            setSoldModalOpen(true);
            setSoldTo("");
            setSelectedOwnerId("");

            setOwnerPurses((prev) => ({
                ...prev,
                [variables.ownerId]:
                    data?.remainingPurse ?? prev[variables.ownerId],
            }));

            queryClient.invalidateQueries({
                queryKey: ["season", seasonId],
            });

            toast.success("Player sold successfully");
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || "Failed to buy player",
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
                            Loading auction...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-hidden bg-[#060816] text-white">
            <Navbar />

            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-0 top-0 h-100 w-100 rounded-full bg-yellow-500/10 blur-[140px]" />
                <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-orange-500/10 blur-[140px]" />
            </div>

            <div className="mx-auto flex h-screen max-w-7xl flex-col px-4 pb-4 pt-24">
                <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
                    <Card className="min-h-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#0d1326]">
                        <CardContent className="h-full overflow-hidden p-4">
                            {!auctionStarted ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400/10">
                                        <Gavel className="h-10 w-10 text-yellow-300" />
                                    </div>

                                    <h2 className="mt-5 text-4xl font-black text-white">
                                        Live Auction
                                    </h2>

                                    <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">
                                        Start live player auction with premium
                                        admin controls.
                                    </p>

                                    <Button
                                        onClick={() => {
                                            setAuctionStarted(true);
                                            setCurrentBid(
                                                currentAuctionPlayer?.basePrice || 0,
                                            );
                                        }}
                                        className="mt-6 h-12 rounded-2xl bg-yellow-400 px-8 text-base font-black text-black hover:bg-yellow-300"
                                    >
                                        Start Auction
                                    </Button>
                                </div>
                            ) : !currentAuctionPlayer ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                                        <Gavel className="h-10 w-10 text-red-400" />
                                    </div>

                                    <h2 className="mt-5 text-3xl font-black text-white">
                                        No Players Available
                                    </h2>

                                    <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">
                                        There are no players available for auction.
                                        Make sure to register more players for this
                                        season.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex h-full min-h-0 flex-col">
                                    <Card className="mb-2 border border-white/10 bg-[#0d1326]">
                                        <CardContent className="p-1">
                                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <h2 className="text-base font-black text-white">
                                                        Auction Player Picker
                                                    </h2>

                                                    <p className="mt-0.5 text-xs text-white/50">
                                                        Search and select player
                                                        for cheeti auction
                                                    </p>
                                                </div>

                                                <Popover
                                                    open={searchOpen}
                                                    onOpenChange={setSearchOpen}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="h-10 w-full border-white/10 bg-[#111827] text-white hover:bg-[#1b2336] md:w-[320px]"
                                                        >
                                                            <Search className="mr-2 h-2 w-4" />

                                                            {currentAuctionPlayer?.name ||
                                                                "Search auction player"}
                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent
                                                        className="w-[320px] border border-white/10 bg-[#0d1326] p-0"
                                                        align="end"
                                                    >
                                                        <Command className="bg-[#0d1326] text-white">
                                                            <CommandInput
                                                                placeholder="Search player..."
                                                                value={playerSearch}
                                                                onValueChange={
                                                                    setPlayerSearch
                                                                }
                                                                className="border-b border-white/10"
                                                            />

                                                            <CommandList>
                                                                {playerSearch.trim().length >
                                                                    0 && (
                                                                        <>
                                                                            <CommandEmpty>
                                                                                No player found.
                                                                            </CommandEmpty>

                                                                            <CommandGroup heading="Auction Players">
                                                                                {filteredAuctionPlayers.map(
                                                                                    (player: any) => (
                                                                                        <CommandItem
                                                                                            key={player._id}
                                                                                            value={player.name}
                                                                                            onSelect={() => {
                                                                                                const realIndex =
                                                                                                    auctionPlayers.findIndex(
                                                                                                        (p: any) =>
                                                                                                            p._id ===
                                                                                                            player._id,
                                                                                                    );

                                                                                                setAuctionIndex(realIndex);
                                                                                                setCurrentBid(
                                                                                                    player.basePrice || 0,
                                                                                                );
                                                                                                setSoldTo("");
                                                                                                setSelectedOwnerId("");
                                                                                                setAuctionTimer(180);
                                                                                                setSearchOpen(false);

                                                                                                toast.success(
                                                                                                    `${player.name} selected for auction`,
                                                                                                );
                                                                                            }}
                                                                                            className="cursor-pointer border-b border-white/5 px-3 py-3 text-white hover:bg-[#1b2336]"
                                                                                        >
                                                                                            <div className="flex w-full items-center justify-between">
                                                                                                <div className="flex items-center gap-3">
                                                                                                    <Avatar className="h-10 w-10 rounded-xl">
                                                                                                        <AvatarImage
                                                                                                            src={
                                                                                                                player.profileImage
                                                                                                            }
                                                                                                        />
                                                                                                    </Avatar>

                                                                                                    <div>
                                                                                                        <p className="font-bold">
                                                                                                            {
                                                                                                                player.name
                                                                                                            }
                                                                                                        </p>

                                                                                                        <p className="text-xs text-white/50">
                                                                                                            {
                                                                                                                player.playingRole
                                                                                                            }
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="text-sm font-black text-yellow-300">
                                                                                                    ₹{player.basePrice}
                                                                                                </div>
                                                                                            </div>
                                                                                        </CommandItem>
                                                                                    ),
                                                                                )}
                                                                            </CommandGroup>
                                                                        </>
                                                                    )}
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
                                        <img
                                            src={currentAuctionPlayer?.profileImage}
                                            alt={currentAuctionPlayer?.name}
                                            className="h-52 w-full rounded-[24px] border border-yellow-400/20 object-cover lg:h-auto lg:w-[300px]"
                                        />

                                        <div className="flex min-h-0 flex-1 flex-col">
                                            <Badge className="border-green-500/20 bg-green-500/10 text-green-300">
                                                LIVE AUCTION
                                            </Badge>

                                            <div className="flex flex-row items-center gap-5">
                                                <h1 className="mt-2 text-3xl font-black text-white">
                                                    {currentAuctionPlayer?.name}
                                                </h1>

                                                <p className="mt-3 text-sm text-yellow-300">
                                                    {currentAuctionPlayer?.playingRole}
                                                </p>
                                            </div>

                                            <div className="mt-3 grid gap-3 md:grid-cols-3">
                                                <div className="rounded-2xl border border-white/10 bg-[#111827] p-4">
                                                    <p className="text-xs text-white/50">
                                                        Base Price
                                                    </p>

                                                    <div className="mt-2 flex items-center text-2xl font-black text-yellow-300">
                                                        <IndianRupee className="mr-1 h-6 w-6" />
                                                        {currentAuctionPlayer?.basePrice}
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                                                    <p className="text-xs text-green-200/70">
                                                        Current Bid
                                                    </p>

                                                    <div className="mt-2 flex items-center text-2xl font-black text-green-300">
                                                        <IndianRupee className="mr-1 h-6 w-6" />
                                                        {currentBid}
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                                                    <p className="text-xs text-red-200/70">
                                                        Timer
                                                    </p>

                                                    <div className="mt-2 flex items-center text-2xl font-black text-red-300">
                                                        <Timer className="mr-2 h-6 w-6" />
                                                        {auctionTimer}s
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400/20">
                                                        <Crown className="text-yellow-300" />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-white/50">
                                                            Highest Bidder
                                                        </p>

                                                        <h3 className="mt-0.5 text-2xl font-black text-white">
                                                            {soldTo || "Waiting for bids"}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2 space-y-3">
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
                                                                ownerId: selectedOwnerId,
                                                                playerId:
                                                                    currentAuctionPlayer?._id,
                                                                amount: currentBid,
                                                            });
                                                        }}
                                                        disabled={
                                                            buyPlayerMutation.isPending
                                                        }
                                                        className="h-12 w-full rounded-xl bg-green-500 text-sm font-black hover:bg-green-600"
                                                    >
                                                        {buyPlayerMutation.isPending ? (
                                                            <Loader2 className="animate-spin" />
                                                        ) : (
                                                            `SOLD TO ${soldTo || "OWNER"}`
                                                        )}
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setUnsoldData({
                                                                name: currentAuctionPlayer?.name,
                                                                image: currentAuctionPlayer?.profileImage,
                                                                role: currentAuctionPlayer?.playingRole,
                                                            });

                                                            setUnsoldModalOpen(true);
                                                        }}
                                                        className="h-12 w-full rounded-xl border-white/10 bg-[#111827] text-sm font-bold text-white hover:bg-[#1b2336]"
                                                    >
                                                        UNSOLD
                                                    </Button>
                                                </div>

                                                <Button
                                                    onClick={goToNextPlayer}
                                                    className="h-12 w-full rounded-xl bg-yellow-400 text-sm font-black text-black hover:bg-yellow-300"
                                                >
                                                    NEXT PLAYER
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0d1326] p-4">
                        <div className="shrink-0">
                            <h2 className="text-xl font-black text-white">
                                Auction Controls
                            </h2>

                            <p className="mt-0.5 text-xs text-white/50">
                                Live bidding panel
                            </p>
                        </div>

                        <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                            <div className="space-y-2">
                                {owners.map((owner: any) => (
                                    <Button
                                        key={owner._id}
                                        onClick={() => {
                                            const ownerPurse =
                                                ownerPurses[owner._id] || 0;

                                            const bidAmount = !soldTo
                                                ? currentAuctionPlayer?.basePrice || 0
                                                : currentBid + 100;

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
                                        className="h-14 w-full justify-between rounded-2xl border border-white/10 bg-[#111827] px-4 text-white transition-all duration-300 hover:bg-yellow-400 hover:text-black"
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
                                            <span className="text-base font-black text-yellow-300">
                                                ₹{ownerPurses[owner._id] || 0}
                                            </span>

                                            <span className="text-xs font-bold">
                                                {!soldTo
                                                    ? `₹${currentAuctionPlayer?.basePrice ||
                                                    0
                                                    }`
                                                    : "+₹100"}
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
                                        {soldData?.playerName}
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-sm text-white/50">
                                        Owner
                                    </p>

                                    <h3 className="text-xl font-bold text-yellow-300">
                                        {soldData?.ownerName}
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-sm text-white/50">
                                        Team
                                    </p>

                                    <h3 className="text-xl font-bold">
                                        {soldData?.teamName}
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-sm text-white/50">
                                        Sold Amount
                                    </p>

                                    <h3 className="text-3xl font-black text-green-400">
                                        ₹{soldData?.amount}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                setSoldModalOpen(false);

                                if (auctionIndex < auctionPlayers.length - 1) {
                                    setAuctionIndex((prev) => prev + 1);
                                    setAuctionTimer(180);
                                    setCurrentBid(
                                        auctionPlayers[auctionIndex + 1]
                                            ?.basePrice || 0,
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
            <Dialog
                open={unsoldModalOpen}
                onOpenChange={setUnsoldModalOpen}
            >
                <DialogContent className="overflow-hidden border border-red-400/20 bg-[#07111F] p-0 text-white sm:max-w-sm">
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-br from-red-500/20 via-transparent to-yellow-400/10" />

                        <div className="relative p-6 text-center">
                            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-red-400/20 bg-[#111827] shadow-2xl shadow-red-500/10">
                                <img
                                    src={unsoldData?.image}
                                    alt={unsoldData?.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <Badge className="mt-5 border-red-500/20 bg-red-500/10 text-red-300">
                                UNSOLD
                            </Badge>

                            <h2 className="mt-4 text-3xl font-black text-white">
                                {unsoldData?.name}
                            </h2>

                            <p className="mt-1 text-sm font-semibold text-yellow-300">
                                {unsoldData?.role}
                            </p>

                            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                                <p className="text-lg font-black text-white">
                                    This is not the end,
                                </p>

                                <p className="mt-1 text-2xl font-black text-yellow-300">
                                    your comeback will be stronger.
                                </p>

                                <p className="mt-3 text-sm leading-6 text-white/60">
                                    Stay ready, keep believing, and let your game speak louder next time.
                                </p>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setUnsoldModalOpen(false)}
                                    className="h-11 rounded-xl border-white/10 bg-[#111827] font-bold text-white hover:bg-[#1b2336]"
                                >
                                    CLOSE
                                </Button>

                                <Button
                                    onClick={() => {
                                        setUnsoldModalOpen(false);
                                        goToNextPlayer();
                                    }}
                                    className="h-11 rounded-xl bg-yellow-400 font-black text-black hover:bg-yellow-300"
                                >
                                    NEXT PLAYER
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}