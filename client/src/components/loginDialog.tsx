import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AxiosError } from "axios";

import {
    ShieldCheck,
    User,
    Users,
    Phone,
    Lock,
    ArrowRight,
    Sparkles,
    Trophy,
    Loader2,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { login as loginApi } from "@/services/auth/authService";
import { useAuthStore } from "@/store/authStore";
import React, {
    useState,
    ReactNode,
    useEffect,
} from "react";

// ======================================================
// TYPES
// ======================================================

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type Role =
    | "player"
    | "owner"
    | "admin";

const loginSchema = z.object({
    mobile: z
        .string()
        .trim()
        .transform((value) => value.replace(/\D/g, "")) // remove non-digits
        .refine(
            (value) => value.length === 10,
            {
                message:
                    "Enter a valid 10-digit mobile number",
            }
        ),

    password: z.string().optional(),
});
type LoginForm = z.infer<typeof loginSchema>;

type LoginResponse = {
    success: boolean;
    token: string;

    user: {
        _id: string;
        name: string;
        role: "PLAYER" | "OWNER" | "ADMIN";
        profileImage: string;
        mobile: string;
    };
};

type RoleCardProps = {
    active: boolean;
    title: string;
    subtitle: string;
    icon: ReactNode;
    onClick: () => void;
    activeClass:
    | "yellow"
    | "blue"
    | "purple";
};

type ApiError = AxiosError<{
    message?: string;
}>;

// ======================================================
// COMPONENT
// ======================================================

export default function LoginDialog({
    open,
    onOpenChange,
}: Props) {

    const [role, setRole] =
        useState<Role>("player");

    const navigate =
        useNavigate();

    const authLogin =
        useAuthStore(
            (state) => state.login
        );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (open) {
            reset({
                mobile: "",
                password: "",
            });
        }
    }, [open, reset]);

    // ======================================================
    // LOGIN MUTATION
    // ======================================================

    const loginMutation =
        useMutation({

            mutationFn: loginApi,

            onSuccess: (
                data: LoginResponse
            ) => {

                authLogin(
                    data.user,
                    data.token
                );

                toast.success(
                    "Login Successful 🎉"
                );

                onOpenChange(false);

                // navigate according to role

                switch (
                data.user.role
                ) {

                    case "PLAYER":
                        navigate(
                            `/players/${data.user._id}`
                        );
                        break;

                    case "OWNER":
                        navigate(
                            "/owner"
                        );
                        break;

                    case "ADMIN":
                        navigate(
                            "/admin"
                        );
                        break;
                }
            },

            onError: (
                error: ApiError
            ) => {

                toast.error(
                    error?.response
                        ?.data
                        ?.message ||
                    "Login failed"
                );
            },
        });

    // ======================================================
    // SUBMIT
    // ======================================================

    const onSubmit = (values: LoginForm) => {
        loginMutation.mutate({
            mobile: values.mobile,
            password:
                role === "player"
                    ? ""
                    : values.password ?? "",
        });
    };

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="max-h-[95vh] overflow-y-auto border border-white/10 bg-[#07111F] p-0 text-white sm:max-w-5xl">

                <div className="grid lg:grid-cols-2">

                    {/* LEFT SIDE */}

                    <div className="relative overflow-hidden bg-[#0A0F1C] p-6 lg:p-10">

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.25),transparent_35%)]" />

                        <div className="absolute -left-10 bottom-0 size-40 rounded-full bg-yellow-500/10 blur-3xl" />

                        <div className="absolute right-0 top-0 size-52 rounded-full bg-orange-500/10 blur-3xl" />

                        <div className="relative z-10 flex items-center gap-4">

                            <div className="flex size-16 items-center justify-center rounded-3xl bg-yellow-400 text-black shadow-2xl">

                                <Trophy size={30} />

                            </div>

                            <div>

                                <h2 className="text-4xl font-black">
                                    RPL 2026
                                </h2>

                                <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">
                                    Login Portal
                                </p>

                            </div>

                        </div>

                        <div className="relative z-10 mt-14">

                            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">

                                <Sparkles size={16} />

                                Redfort Premier League

                            </div>

                            <h3 className="mt-6 text-5xl font-black">

                                Access The

                                <span className="block bg-linear-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">

                                    RPL Dashboard

                                </span>

                            </h3>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="bg-[#0B1120] p-6 sm:p-8">

                        <div className="mb-6 grid grid-cols-3 gap-3">

                            <RoleCard
                                active={role === "player"}
                                title="Player"
                                subtitle="Join Team"
                                icon={<User size={22} />}
                                activeClass="yellow"
                                onClick={() =>
                                    setRole("player")
                                }
                            />

                            <RoleCard
                                active={role === "owner"}
                                title="Owner"
                                subtitle="Manage Team"
                                icon={<Users size={22} />}
                                activeClass="blue"
                                onClick={() =>
                                    setRole("owner")
                                }
                            />

                            <RoleCard
                                active={role === "admin"}
                                title="Admin"
                                subtitle="Control"
                                icon={<ShieldCheck size={22} />}
                                activeClass="purple"
                                onClick={() =>
                                    setRole("admin")
                                }
                            />

                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5"
                        >

                            <div className="space-y-2">

                                <div className="relative">

                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-4 text-white/50 z-10"
                                    />

                                    <Input
                                        {...register("mobile")}
                                        type="tel"
                                        maxLength={10}
                                        placeholder="Enter mobile number"
                                        autoComplete="off"
                                        className={`
            h-13 rounded-xl bg-white/5 pl-12
            text-white placeholder:text-white/40
            ${errors.mobile
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : "border-white/10"
                                            }
            `}
                                    />

                                </div>

                                {errors.mobile && (
                                    <p className="text-xs text-red-400 ml-1">
                                        {errors.mobile.message}
                                    </p>
                                )}

                            </div>

                            {role !== "player" && (

                                <div className="space-y-2">

                                    <div className="relative">

                                        <Lock
                                            size={18}
                                            className="absolute left-4 top-4 text-white/50 z-10"
                                        />

                                        <Input
                                            type="password"
                                            {...register("password")}
                                            placeholder="Enter password"
                                            autoComplete="new-password"
                                            className="h-13 rounded-xl border-white/10 bg-white/5 pl-12 text-white placeholder:text-white/40"
                                        />

                                    </div>

                                    {errors.password && (
                                        <p className="text-xs text-red-400 ml-1">
                                            {errors.password.message}
                                        </p>
                                    )}

                                </div>

                            )}
                            <div className="mt-8 flex gap-4">

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        onOpenChange(false)
                                    }
                                    className="
        h-13 flex-1 rounded-2xl
        border border-white/10
        bg-white/5
        text-white
        backdrop-blur-xl
        transition-all duration-300
        hover:scale-[1.02]
        hover:bg-white/10
        hover:border-white/20
        "
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={
                                        loginMutation.isPending
                                    }
                                    className="
        group h-13 flex-1 rounded-2xl
        bg-linear-to-r
        from-yellow-300
        via-yellow-400
        to-orange-400
        font-bold
        text-black
        shadow-[0_0_25px_rgba(250,204,21,0.35)]
        transition-all duration-300
        hover:scale-[1.02]
        hover:shadow-[0_0_40px_rgba(250,204,21,0.6)]
        disabled:opacity-70
        disabled:hover:scale-100
        "
                                >

                                    {loginMutation.isPending ? (

                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <div className="flex items-center gap-2">

                                            <span>
                                                Continue
                                            </span>

                                            <ArrowRight
                                                size={18}
                                                className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    "
                                            />

                                        </div>

                                    )}

                                </Button>

                            </div>

                        </form>

                    </div>

                </div>

            </DialogContent>

        </Dialog>
    );
}

// ======================================================
// ROLE CARD
// ======================================================

function RoleCard({
    active,
    title,
    subtitle,
    icon,
    onClick,
    activeClass,
}: RoleCardProps) {

    const activeStyles = {
        yellow:
            "border-yellow-400 bg-linear-to-br from-yellow-400/20 to-yellow-500/5",

        blue:
            "border-blue-400 bg-blue-500/10",

        purple:
            "border-purple-400 bg-purple-500/10",
    };

    const iconStyles = {
        yellow:
            "bg-yellow-400 text-black",

        blue:
            "bg-blue-500 text-white",

        purple:
            "bg-purple-500 text-white",
    };

    const textStyles = {
        yellow:
            "text-yellow-400",

        blue:
            "text-blue-400",

        purple:
            "text-purple-400",
    };

    return (

        <button
            type="button"
            onClick={onClick}
            className={`group relative overflow-hidden rounded-2xl border p-4
            transition-all duration-300 hover:scale-[1.03]

            ${active
                    ? activeStyles[activeClass]
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
        >

            {/* glow effect */}

            {active && (

                <div
                    className={`absolute inset-0 opacity-30 blur-2xl

                    ${activeClass === "yellow"
                            ? "bg-yellow-400"
                            : activeClass === "blue"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                        }`}
                />

            )}

            <div className="relative z-10 flex flex-col items-center gap-3">

                <div
                    className={`flex size-12 items-center justify-center rounded-2xl
                    transition-all duration-300

                    ${active
                            ? iconStyles[activeClass]
                            : "bg-white/10 text-white"
                        }`}
                >

                    {icon}

                </div>

                <div className="text-center">

                    <p
                        className={`font-bold text-sm

                        ${active
                                ? textStyles[activeClass]
                                : "text-white"
                            }`}
                    >
                        {title}
                    </p>

                    <p className="mt-1 text-xs text-white/50">
                        {subtitle}
                    </p>

                </div>

            </div>

        </button>
    );
}