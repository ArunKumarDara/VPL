// components/CreateSeasonDialog.tsx

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Calendar,
    Trophy,
} from "lucide-react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { createSeason } from "@/services/seasons/seasonsService";

import { toast } from "sonner";

const createSeasonSchema = z.object({
    title: z
        .string()
        .min(
            3,
            "Season title must contain at least 3 characters"
        ),

    year: z.coerce
        .number()
        .min(
            2020,
            "Enter valid year"
        ),

    auctionDate: z
        .string()
        .min(
            1,
            "Auction date required"
        ),

    tournamentStartDate: z
        .string()
        .min(
            1,
            "Tournament start date required"
        ),

    tournamentEndDate: z
        .string()
        .min(
            1,
            "Tournament end date required"
        ),
});

type FormData = z.infer<
    typeof createSeasonSchema
>;

type Props = {
    open: boolean;
    onOpenChange: (
        open: boolean
    ) => void;
};

export default function CreateSeasonDialog({
    open,
    onOpenChange,
}: Props) {

    const queryClient =
        useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm<FormData>({
        resolver:
            zodResolver(
                createSeasonSchema
            ),

        defaultValues: {
            title: "",
            year:
                new Date().getFullYear(),
            auctionDate: "",
            tournamentStartDate:
                "",
            tournamentEndDate:
                "",
        },
    });

    const mutation =
        useMutation({
            mutationFn:
                createSeason,

            onSuccess: () => {
                toast.success(
                    "Season created successfully"
                );

                queryClient.invalidateQueries({
                    queryKey: [
                        "all-seasons",
                    ],
                });

                reset();

                onOpenChange(
                    false
                );
            },

            onError: (
                error: any
            ) => {
                toast.error(
                    error?.response
                        ?.data
                        ?.message ??
                    "Failed to create season"
                );
            },
        });

    const onSubmit = (
        data: FormData
    ) => {
        mutation.mutate(
            data
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={
                onOpenChange
            }
        >
            <DialogContent
                className="
                max-w-2xl
                h-[90vh]
                p-0
                overflow-hidden
                rounded-3xl
                border-white/10
                bg-[#0b1220]
                text-white
                flex
                flex-col
            "
            >

                {/* HEADER */}

                <div
                    className="
                    relative
                    shrink-0
                    border-b
                    border-white/10
                    bg-linear-to-r
                    from-yellow-400/10
                    to-orange-500/10
                    p-8
                "
                >

                    <div
                        className="
                        absolute
                        right-0
                        top-0
                        h-32
                        w-32
                        rounded-full
                        bg-yellow-400/10
                        blur-3xl
                    "
                    />

                    <DialogHeader>

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-yellow-400/10
                                text-yellow-400
                            "
                            >
                                <Trophy
                                    size={
                                        28
                                    }
                                />
                            </div>

                            <div>

                                <DialogTitle className="text-3xl font-black">

                                    Create Season

                                </DialogTitle>

                                <DialogDescription className="mt-1 text-white/60">

                                    Configure your tournament details

                                </DialogDescription>

                            </div>

                        </div>

                    </DialogHeader>

                </div>

                {/* SCROLLABLE BODY */}

                <div
                    className="
                    flex-1
                    overflow-y-auto
                    px-8
                    py-6
                "
                >

                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="space-y-6"
                    >

                        {/* TITLE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-white/80">

                                Season Title

                            </label>

                            <Input
                                {...register(
                                    "title"
                                )}
                                placeholder="RPL Season 2026"
                                className="
                                h-12
                                border-white/10
                                bg-[#11182f]
                            "
                            />

                            {errors.title && (
                                <p className="mt-2 text-sm text-red-400">

                                    {
                                        errors
                                            .title
                                            .message
                                    }

                                </p>
                            )}

                        </div>

                        {/* YEAR */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-white/80">

                                Year

                            </label>

                            <Input
                                type="number"
                                {...register(
                                    "year"
                                )}
                                className="
                                h-12
                                border-white/10
                                bg-[#11182f]
                            "
                            />

                            {errors.year && (
                                <p className="mt-2 text-sm text-red-400">

                                    {
                                        errors
                                            .year
                                            .message
                                    }

                                </p>
                            )}

                        </div>

                        {/* AUCTION DATE */}

                        <div>

                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">

                                <Calendar
                                    size={
                                        15
                                    }
                                />

                                Auction Date

                            </label>

                            <Input
                                type="date"
                                {...register(
                                    "auctionDate"
                                )}
                                className="
                                h-12
                                border-white/10
                                bg-[#11182f]
                            "
                            />

                            {errors.auctionDate && (
                                <p className="mt-2 text-sm text-red-400">

                                    {
                                        errors
                                            .auctionDate
                                            .message
                                    }

                                </p>
                            )}

                        </div>

                        {/* START DATE */}

                        <div>

                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">

                                <Calendar
                                    size={
                                        15
                                    }
                                />

                                Tournament Start Date

                            </label>

                            <Input
                                type="date"
                                {...register(
                                    "tournamentStartDate"
                                )}
                                className="
                                h-12
                                border-white/10
                                bg-[#11182f]
                            "
                            />

                            {errors.tournamentStartDate && (
                                <p className="mt-2 text-sm text-red-400">

                                    {
                                        errors
                                            .tournamentStartDate
                                            .message
                                    }

                                </p>
                            )}

                        </div>

                        {/* END DATE */}

                        <div>

                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">

                                <Calendar
                                    size={
                                        15
                                    }
                                />

                                Tournament End Date

                            </label>

                            <Input
                                type="date"
                                {...register(
                                    "tournamentEndDate"
                                )}
                                className="
                                h-12
                                border-white/10
                                bg-[#11182f]
                            "
                            />

                            {errors.tournamentEndDate && (
                                <p className="mt-2 text-sm text-red-400">

                                    {
                                        errors
                                            .tournamentEndDate
                                            .message
                                    }

                                </p>
                            )}

                        </div>

                        {/* SUBMIT */}

                        <Button
                            type="submit"
                            disabled={
                                mutation.isPending
                            }
                            className="
                            h-12
                            w-full
                            rounded-2xl
                            bg-linear-to-r
                            from-yellow-300
                            to-orange-400
                            font-bold
                            text-black
                            hover:opacity-90
                        "
                        >
                            {mutation.isPending
                                ? "Creating..."
                                : "Create Season"}
                        </Button>

                    </form>

                </div>

            </DialogContent>

        </Dialog>
    );
}