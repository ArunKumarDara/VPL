import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar";

import { AxiosError } from "axios";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Camera,
    Trophy,
    User,
    Phone,
    MapPin,
    ShieldCheck,
    Loader2,
    Sparkles,
    Crown,
    Users,
} from "lucide-react";

import {
    useState,
    ChangeEvent,
} from "react";

import {
    useForm,
    Controller,
    UseFormRegisterReturn,
} from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    useMutation,
    useQuery,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { registerPlayer } from "@/services/player/playerService";

import { getAllSeasons } from "@/services/seasons/seasonsService"

import { createOwner } from "@/services/owner/ownerService";

// ======================================================
// TYPES
// ======================================================

type RegisterDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type ApiError = AxiosError<{
    message?: string;
}>;

type RoleType =
    | "PLAYER"
    | "OWNER"
    | "ADMIN";

type ActiveClass =
    | "yellow"
    | "blue"
    | "purple";

type FormInputProps = {
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    register: UseFormRegisterReturn;
    error?: string;
    type?: string;
};

type RoleCardProps = {
    active: boolean;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    onClick: () => void;
    activeClass: ActiveClass;
};

type SeasonType = {
    _id: string;
    title: string;
    year: number;
};

// ======================================================
// VALIDATION
// ======================================================

const registerSchema = z
    .object({
        name: z
            .string()
            .min(
                3,
                "Name must be at least 3 characters",
            ),

        mobile: z
            .string()
            .min(
                10,
                "Mobile number must be 10 digits",
            ),

        village: z
            .string()
            .min(
                2,
                "Village is required",
            ),

        roleType: z.enum([
            "PLAYER",
            "OWNER",
            "ADMIN",
        ]),

        season: z.string().optional(),

        playingRole: z
            .string()
            .optional(),

        basePrice: z
            .string()
            .optional(),

        purseValue: z
            .string()
            .optional(),
    })
    .superRefine(
        (data, ctx) => {

            if (
                data.roleType ===
                "PLAYER"
            ) {

                if (
                    !data.playingRole
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [
                            "playingRole",
                        ],
                        message:
                            "Playing role is required",
                    });
                }

                if (
                    !data.basePrice
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [
                            "basePrice",
                        ],
                        message:
                            "Base price is required",
                    });
                }

                if (
                    !data.season
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [
                            "season",
                        ],
                        message:
                            "Season is required",
                    });
                }
            }

            if (
                data.roleType ===
                "OWNER"
            ) {

                if (
                    !data.purseValue
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [
                            "purseValue",
                        ],
                        message:
                            "Purse value is required",
                    });
                }

                if (
                    !data.season
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [
                            "season",
                        ],
                        message:
                            "Season is required",
                    });
                }
            }
        },
    );


type RegisterFormData =
    z.infer<
        typeof registerSchema
    >;

// ======================================================
// COMPONENT
// ======================================================

export default function RegisterDialog({
    open,
    onOpenChange,
}: RegisterDialogProps) {

    // ======================================================
    // STATES
    // ======================================================

    const [role, setRole] =
        useState<RoleType>(
            "PLAYER",
        );

    const [previewImage, setPreviewImage] =
        useState<string>(
            "https://github.com/shadcn.png",
        );

    const [selectedFile, setSelectedFile] =
        useState<File | null>(
            null,
        );

    // ======================================================
    // GET SEASONS
    // ======================================================

    const {
        data: seasonsData,
        isLoading: seasonLoading,
    } = useQuery({
        queryKey: ["seasons"],
        queryFn: getAllSeasons,
    });

    const seasons =
        seasonsData || [];

    // ======================================================
    // FORM
    // ======================================================

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset,
    } = useForm<RegisterFormData>({
        resolver:
            zodResolver(
                registerSchema,
            ),

        defaultValues: {
            roleType:
                "PLAYER",
        },
    });

    const selectedRole =
        watch("roleType");

    // ======================================================
    // IMAGE HANDLER
    // ======================================================

    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);

        const imageUrl =
            URL.createObjectURL(
                file,
            );

        setPreviewImage(
            imageUrl,
        );
    };

    // ======================================================
    // MUTATION
    // ======================================================

    // ======================================================
    // COMMON RESET
    // ======================================================

    const resetForm = () => {

        reset();

        setPreviewImage(
            "https://github.com/shadcn.png",
        );

        setSelectedFile(null);

        setRole("PLAYER");

        onOpenChange(false);
    };

    // ======================================================
    // PLAYER MUTATION
    // ======================================================

    const playerMutation = useMutation({
        mutationFn: registerPlayer,

        onSuccess: (data: { message: string }) => {

            toast.success(
                "Player Registration Successful 🎉",
                {
                    description: data.message
                }
            );

            resetForm();
        },

        onError: (error: ApiError) => {

            toast.error(
                "Player Registration Failed",
                {
                    description:
                        error?.response?.data?.message ||
                        "Something went wrong"
                }
            );
        }
    });

    // ======================================================
    // OWNER MUTATION
    // ======================================================

    const ownerMutation = useMutation({
        mutationFn: createOwner,

        onSuccess: (data: { message: string }) => {

            toast.success(
                "Owner Registration Successful 🎉",
                {
                    description: data.message
                }
            );

            resetForm();
        },

        onError: (error: ApiError) => {

            toast.error(
                "Owner Registration Failed",
                {
                    description:
                        error?.response?.data?.message ||
                        "Something went wrong"
                }
            );
        }
    });

    const onSubmit = (
        data: RegisterFormData,
    ) => {

        if (!selectedFile) {

            toast.error(
                "Please upload profile image",
                {
                    description:
                        "Profile photo is required",
                },
            );

            return;
        }

        const formData =
            new FormData();

        formData.append(
            "name",
            data.name,
        );

        formData.append(
            "mobile",
            data.mobile,
        );

        formData.append(
            "village",
            data.village,
        );

        formData.append(
            "season",
            data.season || "",
        );

        formData.append(
            "profileImage",
            selectedFile,
        );

        if (
            data.roleType ===
            "PLAYER"
        ) {

            formData.append(
                "playingRole",
                data.playingRole || ""
            );

            formData.append(
                "basePrice",
                data.basePrice || "0"
            );

            playerMutation.mutate(
                formData
            );
        }

        else if (
            data.roleType ===
            "OWNER"
        ) {

            formData.append(
                "purseValue",
                data.purseValue || "25000"
            );

            ownerMutation.mutate(
                formData
            );
        }
    };

    // ======================================================
    // JSX
    // ======================================================

    return (
        <Dialog
            open={open}
            onOpenChange={
                onOpenChange
            }
        >
            <DialogContent className="max-h-[95vh] overflow-y-auto border border-white/10 bg-[#07111F] p-0 text-white sm:max-w-6xl">

                <form
                    onSubmit={handleSubmit(
                        onSubmit,
                    )}
                >
                    <div className="grid lg:grid-cols-2">

                        {/* LEFT SIDE */}

                        <div className="relative overflow-hidden bg-[#0A0F1C] p-8 lg:p-10">

                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.25),transparent_35%)]" />

                            <div className="absolute -left-10 bottom-0 size-40 rounded-full bg-yellow-500/10 blur-3xl" />

                            <div className="absolute right-0 top-0 size-52 rounded-full bg-orange-500/10 blur-3xl" />

                            <div className="relative z-10 flex items-center gap-4">

                                <div className="flex size-16 items-center justify-center rounded-3xl bg-yellow-400 text-black shadow-2xl">

                                    <Trophy size={30} />
                                </div>

                                <div>

                                    <h2 className="text-4xl font-black tracking-tight text-white">
                                        RPL 2026
                                    </h2>

                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">
                                        Registration Portal
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 mt-14">

                                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">

                                    <Sparkles size={16} />

                                    Redfort Premier League
                                </div>

                                <h3 className="mt-6 text-5xl font-black leading-tight text-white">

                                    Enter The

                                    <span className="block bg-linear-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                        Auction Arena
                                    </span>
                                </h3>

                                <p className="mt-6 max-w-lg text-base leading-8 text-white/65">
                                    Register yourself as a player,
                                    team owner, or admin and become
                                    part of the RPL experience.
                                </p>
                            </div>

                            <div className="relative z-10 mt-10 grid grid-cols-3 gap-4">

                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

                                    <Users className="mb-3 text-yellow-400" />

                                    <h4 className="text-3xl font-black">
                                        100+
                                    </h4>

                                    <p className="mt-1 text-sm text-white/60">
                                        Players
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

                                    <ShieldCheck className="mb-3 text-blue-400" />

                                    <h4 className="text-3xl font-black">
                                        5
                                    </h4>

                                    <p className="mt-1 text-sm text-white/60">
                                        Teams
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

                                    <Crown className="mb-3 text-purple-400" />

                                    <h4 className="lg:text-3xl font-black 2xl">
                                        ₹5000
                                    </h4>

                                    <p className="mt-1 text-sm text-white/60">
                                        Prize
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}

                        <div className="bg-[#0B1120] p-8">

                            {/* TOP */}

                            <div className="mb-8">

                                <div className="mb-6 grid grid-cols-3 gap-3">

                                    <RoleCard
                                        active={
                                            role ===
                                            "PLAYER"
                                        }
                                        title="Player"
                                        subtitle="Join Auction"
                                        icon={
                                            <Trophy size={22} />
                                        }
                                        activeClass="yellow"
                                        onClick={() => {

                                            setRole(
                                                "PLAYER",
                                            );

                                            setValue(
                                                "roleType",
                                                "PLAYER",
                                            );
                                        }}
                                    />

                                    <RoleCard
                                        active={
                                            role ===
                                            "OWNER"
                                        }
                                        title="Owner"
                                        subtitle="Buy Players"
                                        icon={
                                            <ShieldCheck size={22} />
                                        }
                                        activeClass="blue"
                                        onClick={() => {

                                            setRole(
                                                "OWNER",
                                            );

                                            setValue(
                                                "roleType",
                                                "OWNER",
                                            );
                                        }}
                                    />

                                    <RoleCard
                                        active={
                                            role ===
                                            "ADMIN"
                                        }
                                        title="Admin"
                                        subtitle="Manage"
                                        icon={
                                            <User size={22} />
                                        }
                                        activeClass="purple"
                                        onClick={() => {

                                            setRole(
                                                "ADMIN",
                                            );

                                            setValue(
                                                "roleType",
                                                "ADMIN",
                                            );
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h3 className="text-3xl font-black">
                                            Register Now
                                        </h3>

                                        <p className="mt-2 text-sm text-white/60">
                                            Fill your details below
                                        </p>
                                    </div>

                                    <div className="relative">

                                        <Avatar className="size-24 rounded-3xl border-2 border-yellow-400">

                                            <AvatarImage
                                                src={
                                                    previewImage
                                                }
                                            />
                                        </Avatar>

                                        <label className="absolute -bottom-2 -right-2 flex size-10 cursor-pointer items-center justify-center rounded-full bg-yellow-400 text-black shadow-xl">

                                            <Camera size={18} />

                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={
                                                    handleImageChange
                                                }
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* FORM */}

                            <div className="grid gap-5">

                                <FormInput
                                    label="Full Name"
                                    icon={
                                        <User size={18} />
                                    }
                                    placeholder="Enter your full name"
                                    register={register(
                                        "name",
                                    )}
                                    error={
                                        errors.name
                                            ?.message
                                    }
                                />

                                <FormInput
                                    label="Mobile Number"
                                    icon={
                                        <Phone size={18} />
                                    }
                                    placeholder="9876543210"
                                    register={register(
                                        "mobile",
                                    )}
                                    error={
                                        errors.mobile
                                            ?.message
                                    }
                                />

                                <FormInput
                                    label="Village / Area"
                                    icon={
                                        <MapPin size={18} />
                                    }
                                    placeholder="Enter your area"
                                    register={register(
                                        "village",
                                    )}
                                    error={
                                        errors.village
                                            ?.message
                                    }
                                />

                                {/* PLAYER */}

                                {selectedRole ===
                                    "PLAYER" && (
                                        <>
                                            <div>

                                                <p className="mb-2 text-sm font-semibold text-white/70">
                                                    Playing Role
                                                </p>

                                                <Input
                                                    {...register(
                                                        "playingRole",
                                                    )}
                                                    placeholder="Batsman / Bowler / All-Rounder"
                                                    className="h-13 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30"
                                                />

                                                {errors.playingRole && (
                                                    <p className="mt-1 text-sm text-red-400">
                                                        {
                                                            errors
                                                                .playingRole
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <FormInput
                                                label="Base Price"
                                                icon={
                                                    <Trophy size={18} />
                                                }
                                                placeholder="Enter base price"
                                                register={register(
                                                    "basePrice",
                                                )}
                                                error={
                                                    errors
                                                        .basePrice
                                                        ?.message
                                                }
                                                type="number"
                                            />

                                            {/* SEASON */}

                                            <div>

                                                <p className="mb-2 text-sm font-semibold text-white/70">
                                                    Season
                                                </p>

                                                <Controller
                                                    control={
                                                        control
                                                    }
                                                    name="season"
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <Select
                                                            value={
                                                                field.value
                                                            }
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                        >
                                                            <SelectTrigger className="h-13 rounded-xl border-white/10 bg-white/5 text-white">

                                                                <SelectValue placeholder="Select season" />
                                                            </SelectTrigger>

                                                            <SelectContent className="border-white/10 bg-[#111827] text-white">

                                                                {seasonLoading ? (
                                                                    <SelectItem value="loading">
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : (
                                                                    seasons.map(
                                                                        (
                                                                            season: SeasonType,
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
                                                                                }{" "}
                                                                                -
                                                                                {" "}
                                                                                {
                                                                                    season.year
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />

                                                {errors.season && (
                                                    <p className="mt-1 text-sm text-red-400">
                                                        {
                                                            errors
                                                                .season
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                {/* OWNER */}

                                {selectedRole ===
                                    "OWNER" && (
                                        <>
                                            <FormInput
                                                label="Purse Value"
                                                icon={
                                                    <ShieldCheck size={18} />
                                                }
                                                placeholder="Enter purse amount"
                                                register={register(
                                                    "purseValue",
                                                )}
                                                error={
                                                    errors
                                                        .purseValue
                                                        ?.message
                                                }
                                                type="number"
                                            />

                                            {/* SEASON */}

                                            <div>

                                                <p className="mb-2 text-sm font-semibold text-white/70">
                                                    Season
                                                </p>

                                                <Controller
                                                    control={
                                                        control
                                                    }
                                                    name="season"
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <Select
                                                            value={
                                                                field.value
                                                            }
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                        >
                                                            <SelectTrigger className="h-13 rounded-xl border-white/10 bg-white/5 text-white">

                                                                <SelectValue placeholder="Select season" />
                                                            </SelectTrigger>

                                                            <SelectContent className="border-white/10 bg-[#111827] text-white">

                                                                {seasonLoading ? (
                                                                    <SelectItem value="loading">
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : (
                                                                    seasons.map(
                                                                        (
                                                                            season: SeasonType,
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
                                                                                }{" "}
                                                                                -
                                                                                {" "}
                                                                                {
                                                                                    season.year
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />

                                                {errors.season && (
                                                    <p className="mt-1 text-sm text-red-400">
                                                        {
                                                            errors
                                                                .season
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                {/* BUTTONS */}

                                <div className="mt-5 flex gap-4">

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            onOpenChange(
                                                false,
                                            )
                                        }
                                        className="h-13 flex-1 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={
                                            playerMutation.isPending ||
                                            ownerMutation.isPending
                                        }
                                        className="h-13 flex-1 rounded-xl bg-yellow-400 font-bold text-black hover:bg-yellow-500"
                                    >
                                        {(
                                            playerMutation.isPending ||
                                            ownerMutation.isPending
                                        ) ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            "Submit Registration"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ======================================================
// REUSABLE INPUT
// ======================================================

function FormInput({
    label,
    icon,
    placeholder,
    register,
    error,
    type = "text",
}: FormInputProps) {

    return (
        <div>

            <p className="mb-2 text-sm font-semibold text-white/70">
                {label}
            </p>

            <div className="relative">

                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    {icon}
                </div>

                <Input
                    type={type}
                    {...register}
                    placeholder={placeholder}
                    className="h-13 rounded-xl border-white/10 bg-white/5 pl-12 text-white placeholder:text-white/30"
                />
            </div>

            {
                error && (
                    <p className="mt-1 text-sm text-red-400">
                        {error}
                    </p>
                )
            }
        </div >
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
            className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02]

                ${active
                    ? activeStyles[
                    activeClass
                    ]
                    : "border-white/10 bg-white/5"
                }
            `}
        >
            <div className="relative z-10 flex flex-col items-center gap-2">

                <div
                    className={`flex size-12 items-center justify-center rounded-2xl

                    ${active
                            ? iconStyles[
                            activeClass
                            ]
                            : "bg-white/10 text-white"
                        }
                `}
                >
                    {icon}
                </div>

                <div className="text-center">

                    <p
                        className={`font-bold

                        ${active
                                ? textStyles[
                                activeClass
                                ]
                                : "text-white"
                            }
                    `}
                    >
                        {title}
                    </p>

                    <p className="text-xs text-white/50">
                        {subtitle}
                    </p>
                </div>
            </div>
        </button>
    );
}