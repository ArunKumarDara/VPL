import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    Shield,
    Camera,
    Loader2,
    Sparkles,
    Users,
} from "lucide-react";

import {
    Controller,
    useForm,
} from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ChangeEvent,
    useMemo,
    useState,
} from "react";

import { toast } from "sonner";

import { createTeam } from "@/services/team/teamService";

import { getAllSeasons } from "@/services/seasons/seasonsService";

import { getAllOwners } from "@/services/owner/ownerService";
import { Owner } from "@/api/ownerApi";
import { AxiosError } from "axios";


// ======================================================
// TYPES
// ======================================================

type ApiError = AxiosError<{
    message?: string;
}>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type SeasonType = {
    _id: string;
    title: string;
};

type OwnerType = {
    _id: string;
    name: string;
    season?: {
        _id: string;
    };
    owner: Owner[]
};

type FormDataType = {
    name: string;
    maxPlayers: string;
    season: string;
    ownerName: string;
};

// ======================================================
// VALIDATION
// ======================================================

const schema = z.object({
    name: z
        .string()
        .min(3, "Team name is required"),

    maxPlayers: z
        .string()
        .min(1, "Max players required"),

    season: z
        .string()
        .min(1, "Season required"),

    ownerName: z
        .string()
        .min(1, "Owner required"),
});

// ======================================================
// COMPONENT
// ======================================================

export default function CreateTeamDialog({
    open,
    onOpenChange,
}: Props) {

    const queryClient =
        useQueryClient();

    const [previewImage, setPreviewImage] =
        useState(
            "https://github.com/shadcn.png",
        );

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    // ======================================================
    // FORM
    // ======================================================

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: {
            errors,
        },
    } = useForm<FormDataType>({
        resolver:
            zodResolver(schema),

        defaultValues: {
            maxPlayers: "25",
        },
    });

    const selectedSeason =
        watch("season");

    // ======================================================
    // QUERIES
    // ======================================================

    const {
        data: seasons = [],
    } = useQuery({
        queryKey: ["all-seasons"],
        queryFn: getAllSeasons,
    });

    const {
        data: ownersData,
    } = useQuery({
        queryKey: ["all-owners"],
        queryFn: getAllOwners,
    });

    const filteredOwners =
        useMemo(() => {

            return (
                ownersData?.owners?.filter(
                    (owner: OwnerType) =>
                        owner?.season?._id ===
                        selectedSeason,
                ) || []
            );
        }, [
            ownersData,
            selectedSeason,
        ]);

    // ======================================================
    // IMAGE
    // ======================================================

    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {

        const file =
            e.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);

        setPreviewImage(
            URL.createObjectURL(file),
        );
    };

    // ======================================================
    // MUTATION
    // ======================================================

    const createTeamMutation =
        useMutation({
            mutationFn: createTeam,

            onSuccess: (data) => {
                toast.success("Team Created Successfully 🎉", {
                    description: data.message,
                });

                // REFRESH DASHBOARD DATA
                queryClient.invalidateQueries({
                    queryKey: ["all-seasons"],
                });

                queryClient.invalidateQueries({
                    queryKey: ["all-teams"],
                });

                queryClient.invalidateQueries({
                    queryKey: ["all-owners"],
                });

                onOpenChange(false);
                reset();
                setSelectedFile(null);

                setPreviewImage(
                    "https://github.com/shadcn.png",
                );

            },

            onError: (error: ApiError) => {

                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to create team",
                );
            },
        });

    // ======================================================
    // SUBMIT
    // ======================================================

    const onSubmit = (
        data: FormDataType,
    ) => {

        if (!selectedFile) {

            toast.error(
                "Please upload team logo",
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
            "maxPlayers",
            data.maxPlayers,
        );

        formData.append(
            "season",
            data.season,
        );

        formData.append(
            "ownerName",
            data.ownerName,
        );

        formData.append(
            "profileImage",
            selectedFile,
        );

        createTeamMutation.mutate(
            formData,
        );
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
            <DialogContent className="max-h-[95vh] overflow-y-auto border border-white/10 bg-[#07111F] p-0 text-white sm:max-w-5xl">

                <form
                    onSubmit={handleSubmit(
                        onSubmit,
                    )}
                >
                    <div className="grid lg:grid-cols-2">

                        {/* LEFT */}

                        <div className="relative overflow-hidden bg-[#0A0F1C] p-10">

                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.25),transparent_35%)]" />

                            <div className="relative z-10">

                                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">

                                    <Sparkles size={16} />

                                    RPL Team Management
                                </div>

                                <h2 className="mt-8 text-5xl font-black leading-tight">

                                    Create Your

                                    <span className="block bg-linear-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                        Team Franchise
                                    </span>
                                </h2>

                                <p className="mt-6 text-white/60 leading-8">
                                    Assign owners, upload logo and create modern tournament teams for auction battles.
                                </p>

                                <div className="mt-10 grid grid-cols-2 gap-4">

                                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

                                        <Users className="mb-3 text-yellow-400" />

                                        <h3 className="text-3xl font-black">
                                            17
                                        </h3>

                                        <p className="text-sm text-white/60">
                                            Max Players
                                        </p>
                                    </div>

                                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

                                        <Shield className="mb-3 text-blue-400" />

                                        <h3 className="text-3xl font-black">
                                            RPL
                                        </h3>

                                        <p className="text-sm text-white/60">
                                            Team System
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}

                        <div className="bg-[#0B1120] p-8">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-3xl font-black">
                                        Create Team
                                    </h2>

                                    <p className="mt-2 text-sm text-white/60">
                                        Fill all required team details
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

                                    <label className="absolute -bottom-2 -right-2 flex size-10 cursor-pointer items-center justify-center rounded-full bg-yellow-400 text-black">

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

                            <div className="mt-8 grid gap-5">

                                {/* TEAM NAME */}

                                <div>

                                    <p className="mb-2 text-sm font-semibold text-white/70">
                                        Team Name
                                    </p>

                                    <Input
                                        {...register(
                                            "name",
                                        )}
                                        placeholder="Enter team name"
                                        className="h-13 rounded-xl border-white/10 bg-white/5 text-white"
                                    />

                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {
                                                errors
                                                    .name
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* SEASON */}

                                <div>

                                    <p className="mb-2 text-sm font-semibold text-white/70">
                                        Select Season
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

                                                    {seasons.map(
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
                                                                }
                                                            </SelectItem>
                                                        ),
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

                                {/* OWNER */}

                                <div>

                                    <p className="mb-2 text-sm font-semibold text-white/70">
                                        Select Owner
                                    </p>

                                    <Controller
                                        control={
                                            control
                                        }
                                        name="ownerName"
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
                                                disabled={
                                                    !selectedSeason
                                                }
                                            >
                                                <SelectTrigger className="h-13 rounded-xl border-white/10 bg-white/5 text-white">

                                                    <SelectValue placeholder="Select owner" />
                                                </SelectTrigger>

                                                <SelectContent className="border-white/10 bg-[#111827] text-white">

                                                    {filteredOwners.map(
                                                        (
                                                            owner: OwnerType,
                                                        ) => (
                                                            <SelectItem
                                                                key={
                                                                    owner._id
                                                                }
                                                                value={
                                                                    owner._id
                                                                }
                                                            >
                                                                {
                                                                    owner.name
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    {errors.ownerName && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {
                                                errors
                                                    .ownerName
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* MAX PLAYERS */}

                                <div>

                                    <p className="mb-2 text-sm font-semibold text-white/70">
                                        Max Players
                                    </p>

                                    <Input
                                        type="number"
                                        {...register(
                                            "maxPlayers",
                                        )}
                                        className="h-13 rounded-xl border-white/10 bg-white/5 text-white"
                                    />
                                </div>

                                {/* BUTTONS */}

                                <div className="mt-4 flex gap-4">

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            onOpenChange(
                                                false,
                                            )
                                        }
                                        className="h-13 flex-1 rounded-xl border-white/10 bg-white/5 text-white"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={
                                            createTeamMutation.isPending
                                        }
                                        className="h-13 flex-1 rounded-xl bg-yellow-400 font-bold text-black hover:bg-yellow-500"
                                    >
                                        {createTeamMutation.isPending ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            "Create Team"
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