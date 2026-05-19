import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import {
  CircleDot,
  Shield,
  Trophy,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import RegisterDialog from "./components/RegisterDialog";

import heroImg from "./assets/vpl-home1.jpg";

type StatCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
};

type TimeCardProps = {
  value: string;
  label: string;
};

const navItems = ["Teams", "Players", "Matches", "Auction"];

const stats = [
  { icon: <Shield size={22} />, value: "5", label: "Teams" },
  { icon: <Users size={22} />, value: "100", label: "Players" },
  { icon: <CircleDot size={22} />, value: "15+", label: "Matches" },
  { icon: <Trophy size={22} />, value: "₹5000", label: "Prize Pool" },
];


export default function App() {
  const targetDate = new Date("2026-05-28T09:00:00");
  const [registerOpen, setRegisterOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        (1000 * 60 * 60)
      );

      const mins = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
      );

      const secs = Math.floor(
        (distance % (1000 * 60)) / 1000
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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050816]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-sm font-black text-black shadow-lg shadow-yellow-400/20 sm:size-12">
              VPL
            </div>

            <div>
              <h1 className="text-sm font-black leading-none tracking-wide sm:text-lg">
                VIDHYANAGAR
              </h1>

              <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-yellow-400 sm:text-sm">
                PREMIER LEAGUE
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/75 lg:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="transition hover:text-yellow-400"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop Button */}
          <div className="hidden lg:block">
            <Button className="h-10 rounded-xl bg-indigo-600 px-6 text-sm font-semibold hover:bg-indigo-700">
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-lg transition hover:bg-white/10 lg:hidden"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${mobileMenuOpen
            ? "max-h-100 opacity-100"
            : "max-h-0 opacity-0"
            }`}
        >
          <div className="border-t border-white/10 bg-[#0B1120]/95 backdrop-blur-2xl">
            <div className="space-y-2 px-4 py-5">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-300"
                >
                  {item}
                </a>
              ))}

              <Button className="mt-3 h-11 w-full rounded-xl bg-indigo-600 text-sm font-bold hover:bg-indigo-700">
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Vidhyanagar Premier League"
            className="h-fit w-fit bg-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/45 via-[#050816]/80 to-[#050816]" />
          <div className="absolute inset-0 bg-linear-to-r from-[#050816] via-[#050816]/70 to-transparent" />
        </div>

        <section className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-16 lg:gap-14 lg:pb-20">
          <div className="max-w-3xl">
            <p className="mb-4 lg-pl-14 text-xs font-bold uppercase tracking-[0.45em] text-yellow-300/90 sm:text-sm">
              Season 1
            </p>

            <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
              The Battle
              <span className="block italic text-yellow-400">For Glory</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Join the biggest hometown cricket tournament and watch teams,
              players, and rivalries come alive under the VPL lights.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => setRegisterOpen(true)} className="cursor-pointer h-13 rounded-xl bg-yellow-400 px-8 text-base font-bold text-black hover:bg-yellow-500">
                Register Now
              </Button>

              <Button
                variant="outline"
                className="cursor-pointer h-13 rounded-xl border-white/20 bg-white/10 px-8 text-base font-bold text-white hover:bg-white/15"
              >
                Explore Teams
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
              {/* Desktop Layout */}
              <div className="hidden items-center justify-center gap-26 lg:flex">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/55 whitespace-nowrap">
                  Tournament Starts In
                </p>

                <div className="grid grid-cols-4 lg:gap-5">
                  <TimeCard value={timeLeft.days} label="Days" />
                  <TimeCard value={timeLeft.hours} label="Hours" />
                  <TimeCard value={timeLeft.mins} label="Mins" />
                  <TimeCard value={timeLeft.secs} label="Secs" />
                </div>
              </div>

              {/* Mobile & Tablet Layout */}
              <div className="lg:hidden">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/55">
                  Tournament Starts In
                </p>

                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  <TimeCard value={timeLeft.days} label="Days" />
                  <TimeCard value={timeLeft.hours} label="Hours" />
                  <TimeCard value={timeLeft.mins} label="Mins" />
                  <TimeCard value={timeLeft.secs} label="Secs" />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/45">
                  VPL Season 1
                </p>

                <div className="mt-4 flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-400">
                    <Trophy size={26} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black leading-tight sm:text-3xl">
                      The First Ever
                      <span className="block text-yellow-400">
                        Vidhyanagar Premier League
                      </span>
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/60">
                      A new cricket tradition begins. Experience thrilling matches,
                      live auctions, passionate teams, and unforgettable moments in
                      the inaugural VPL season.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-black/20 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Opening Season
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      2026 Edition
                    </p>
                  </div>

                  <div className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-black">
                    Season 1
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-white/45">
                Organized By
              </p>

              {/* Contact Numbers */}
              <div className="mt-6 gap-3 sm:grid-cols-2 flex justify-between items-center">
                <div className="lg:ml-30">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Vihari
                  </p>
                  <Separator />
                  <p className="mt-1 text-base font-semibold text-muted group-hover:text-white">
                    98765 43210
                  </p>
                </div>

                <div className="lg:mr-30">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Vivek
                  </p>
                  <Separator />
                  <p className="mt-1 text-base font-semibold group-hover:text-white text-muted">
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
    </div>
  );
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-white/[0.1] sm:p-5">
      <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
        {icon}
      </div>

      <h3 className="text-3xl font-black leading-none sm:text-4xl">{value}</h3>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
        {label}
      </p>
    </div>
  );
}

function TimeCard({ value, label }: TimeCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-2 py-4 text-center">
      <h3 className="text-2xl font-black leading-none sm:text-3xl">{value}</h3>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-white/45 sm:text-xs">
        {label}
      </p>
    </div>
  );
}     