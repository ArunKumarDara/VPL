// pages/HomePage.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    CircleDot,
    Shield,
    Trophy,
    Users,

} from "lucide-react";

import { useEffect, useState, type ReactNode } from "react";
import RegisterDialog from "@/components/RegisterDialog";
import LoginDialog from "@/components/loginDialog"

import heroImg from "../assets/vpl-home1.jpg";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

type StatCardProps = {
    icon: ReactNode;
    value: string;
    label: string;
};

type TimeCardProps = {
    value: string;
    label: string;
};



const stats = [
    { icon: <Shield size={22} />, value: "5", label: "Teams" },
    { icon: <Users size={22} />, value: "100", label: "Players" },
    { icon: <CircleDot size={22} />, value: "15+", label: "Matches" },
    { icon: <Trophy size={22} />, value: "₹5000", label: "Prize Pool" },
];

export default function HomePage() {
    const navigate = useNavigate()
    const targetDate = new Date("2026-05-28T09:00:00");

    const [registerOpen, setRegisterOpen] = useState(false);

    const [loginOpen, setLoginOpen] = useState(false);


    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        mins: "00",
        secs: "00",
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();

            const distance = targetDate.getTime() - now;

            if (distance <= 0) {
                clearInterval(interval);

                setTimeLeft({
                    days: "00",
                    hours: "00",
                    mins: "00",
                    secs: "00",
                });

                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));

            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60),
            );

            const mins = Math.floor(
                (distance % (1000 * 60 * 60)) /
                (1000 * 60),
            );

            const secs = Math.floor(
                (distance % (1000 * 60)) / 1000,
            );

            setTimeLeft({
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                mins: String(mins).padStart(2, "0"),
                secs: String(secs).padStart(2, "0"),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            <main className="relative min-h-screen overflow-hidden pt-24">
                <div className="absolute inset-0">
                    <img
                        src={heroImg}
                        alt="RPL"
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-b from-black/45 via-[#050816]/80 to-[#050816]" />

                    <div className="absolute inset-0 bg-linear-to-r from-[#050816] via-[#050816]/70 to-transparent" />
                </div>

                <section className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-16 lg:gap-14 lg:pb-20">
                    <div className="max-w-3xl">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.45em] text-yellow-300/90 sm:text-sm">
                            Season 2
                        </p>

                        <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
                            The Battle
                            <span className="block italic text-yellow-400">
                                For Glory
                            </span>
                        </h2>

                        <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                            Join the biggest hometown cricket
                            tournament and watch teams, players,
                            and rivalries come alive under the
                            RPL lights.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                onClick={() =>
                                    setRegisterOpen(true)
                                }
                                className="h-13 rounded-xl bg-yellow-400 px-8 text-base font-bold text-black hover:bg-yellow-500"
                            >
                                Register Now
                            </Button>

                            <Button
                                onClick={() => navigate("/teams")}
                                variant="outline"
                                className="h-13 rounded-xl border-white/20 bg-white/10 px-8 text-base font-bold text-white hover:bg-white/15"
                            >
                                Explore Teams
                            </Button>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <StatCard
                                    key={stat.label}
                                    {...stat}
                                />
                            ))}
                        </div>
                    </div>

                    {/* COUNTDOWN */}
                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
                            <div className="hidden items-center justify-center gap-26 lg:flex">
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/55 whitespace-nowrap">
                                    Tournament Starts In
                                </p>

                                <div className="grid grid-cols-4 lg:gap-5">
                                    <TimeCard
                                        value={timeLeft.days}
                                        label="Days"
                                    />

                                    <TimeCard
                                        value={timeLeft.hours}
                                        label="Hours"
                                    />

                                    <TimeCard
                                        value={timeLeft.mins}
                                        label="Mins"
                                    />

                                    <TimeCard
                                        value={timeLeft.secs}
                                        label="Secs"
                                    />
                                </div>
                            </div>

                            <div className="lg:hidden">
                                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/55">
                                    Tournament Starts In
                                </p>

                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                    <TimeCard
                                        value={timeLeft.days}
                                        label="Days"
                                    />

                                    <TimeCard
                                        value={timeLeft.hours}
                                        label="Hours"
                                    />

                                    <TimeCard
                                        value={timeLeft.mins}
                                        label="Mins"
                                    />

                                    <TimeCard
                                        value={timeLeft.secs}
                                        label="Secs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                            <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-white/45">
                                Organized By
                            </p>

                            <div className="mt-6 flex items-center justify-between gap-3 sm:grid-cols-2">
                                <div className="lg:ml-30">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                        Vihari
                                    </p>

                                    <Separator />

                                    <p className="mt-1 text-base font-semibold">
                                        7799116854
                                    </p>
                                </div>

                                <div className="lg:mr-30">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                        Vivek
                                    </p>

                                    <Separator />

                                    <p className="mt-1 text-base font-semibold">
                                        91234 56789
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </section>
            </main>

            <RegisterDialog
                open={registerOpen}
                onOpenChange={setRegisterOpen}
            />

            <LoginDialog
                open={loginOpen}
                onOpenChange={setLoginOpen}
            />
        </div>
    );
}

function StatCard({
    icon,
    value,
    label,
}: StatCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-white/[0.1] sm:p-5">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                {icon}
            </div>

            <h3 className="text-3xl font-black leading-none sm:text-4xl">
                {value}
            </h3>

            <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                {label}
            </p>
        </div>
    );
}

function TimeCard({
    value,
    label,
}: TimeCardProps) {
    return (
        <div className="rounded-xl border border-white/10 bg-black/30 px-2 py-4 text-center">
            <h3 className="text-2xl font-black leading-none sm:text-3xl">
                {value}
            </h3>

            <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-white/45 sm:text-xs">
                {label}
            </p>
        </div>
    );
}