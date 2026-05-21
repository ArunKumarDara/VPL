// pages/AuctionPage.tsx

import Navbar from "@/components/Navbar";

import {
    Gavel,
    Sparkles,
    CalendarDays,
    Clock3,
    Trophy,
    Shield,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

export default function AuctionPage() {
    return (
        <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
            <Navbar />

            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-yellow-500/10 blur-[120px]" />

                <div className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[120px]" />
            </div>

            <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-28">
                <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* LEFT */}
                    <div>
                        <Badge className="border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-yellow-300">
                            <Sparkles className="mr-2 h-4 w-4" />
                            LIVE AUCTION EVENT
                        </Badge>

                        <h1 className="mt-7 text-6xl font-black leading-none tracking-tight md:text-7xl">
                            Auction
                            <br />

                            <span className="bg-linear-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                This Sunday
                            </span>
                        </h1>

                        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/50">
                            The official player auction is happening
                            this Sunday. Owners will battle for the
                            best players and build their strongest
                            squads for the season.
                        </p>

                        {/* INFO CARDS */}
                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10">
                                    <CalendarDays className="h-6 w-6 text-yellow-300" />
                                </div>

                                <h3 className="mt-4 text-lg font-black">
                                    Auction Day
                                </h3>

                                <p className="mt-2 text-sm text-white/45">
                                    Sunday
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10">
                                    <Clock3 className="h-6 w-6 text-orange-300" />
                                </div>

                                <h3 className="mt-4 text-lg font-black">
                                    Live Bidding
                                </h3>

                                <p className="mt-2 text-sm text-white/45">
                                    Real-time player auction
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10">
                                    <Trophy className="h-6 w-6 text-green-300" />
                                </div>

                                <h3 className="mt-4 text-lg font-black">
                                    Teams
                                </h3>

                                <p className="mt-2 text-sm text-white/45">
                                    Owners build final squads
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                                    <Shield className="h-6 w-6 text-blue-300" />
                                </div>

                                <h3 className="mt-4 text-lg font-black">
                                    Premium Event
                                </h3>

                                <p className="mt-2 text-sm text-white/45">
                                    Hosted officially for the season
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="relative flex items-center justify-center">
                        <div className="relative flex h-[520px] w-full items-center justify-center overflow-hidden rounded-[40px] border border-white/10 bg-[#0B1220]/90">
                            {/* GLOW */}
                            <div className="absolute h-72 w-72 rounded-full bg-yellow-400/10 blur-[120px]" />

                            {/* CONTENT */}
                            <div className="relative z-10 text-center">
                                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10">
                                    <Gavel className="h-16 w-16 text-yellow-300" />
                                </div>

                                <h2 className="mt-8 text-5xl font-black tracking-tight text-white">
                                    Auction Day
                                </h2>

                                <p className="mt-4 text-lg text-white/45">
                                    Get ready for the biggest bidding war
                                </p>

                                <div className="mt-10 flex items-center justify-center gap-3">
                                    <Badge className="border border-white/10 bg-white/[0.04] px-4 py-2 text-white">
                                        Live Auction
                                    </Badge>

                                    <Badge className="border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-yellow-300">
                                        This Sunday
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* OUTER GLOW */}
                        <div className="absolute -bottom-10 left-1/2 -z-10 h-44 w-44 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[100px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}