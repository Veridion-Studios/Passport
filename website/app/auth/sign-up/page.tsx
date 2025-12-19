"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    Loader2,
    X,
} from "lucide-react";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
    </svg>
);

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleVisibility = () => setIsVisible((prev) => !prev);
    const toggleVisibilityConfirm = () => setIsVisibleConfirm((prev) => !prev);

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-background dark:bg-zinc-950 py-12">
            <div className="mx-auto w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 rounded-xl p-8 shadow-lg">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Create your account
                    </h1>
                    <p className="text-muted-foreground dark:text-zinc-400">
                        Enter your information to sign up and access your dashboard.
                    </p>
                </div>

                <div className="space-y-5">
                    <Button
                        variant="outline"
                        className="w-full justify-center gap-2 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
                    >
                        <GoogleIcon className="h-4 w-4" />
                        Sign up with Google
                    </Button>

                    <div className="flex items-center gap-2">
                        <Separator className="flex-1" />
                        <span className="text-sm text-muted-foreground dark:text-zinc-400">
                            or sign up with email
                        </span>
                        <Separator className="flex-1" />
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label
                                    htmlFor="first-name"
                                    className="dark:text-zinc-200"
                                >
                                    First name
                                </Label>
                                <div className="relative mt-2.5">
                                    <Input
                                        id="first-name"
                                        className="peer ps-9"
                                        placeholder="Max"
                                        required
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        value={firstName}
                                    />
                                    <div className="text-muted-foreground/80 dark:text-zinc-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                        <User size={16} aria-hidden="true" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label
                                    htmlFor="last-name"
                                    className="dark:text-zinc-200"
                                >
                                    Last name
                                </Label>
                                <div className="relative mt-2.5">
                                    <Input
                                        id="last-name"
                                        className="peer ps-9"
                                        placeholder="Robinson"
                                        required
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        value={lastName}
                                    />
                                    <div className="text-muted-foreground/80 dark:text-zinc-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                        <User size={16} aria-hidden="true" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email" className="dark:text-zinc-200">
                                Email
                            </Label>
                            <div className="relative mt-2.5">
                                <Input
                                    id="email"
                                    className="peer ps-9"
                                    placeholder="example@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div className="text-muted-foreground/80 dark:text-zinc-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                    <Mail size={16} aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password" className="dark:text-zinc-200">
                                Password
                            </Label>
                            <div className="relative mt-2.5">
                                <Input
                                    id="password"
                                    className="ps-9 pe-9"
                                    placeholder="Enter your password"
                                    type={isVisible ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <div className="text-muted-foreground/80 dark:text-zinc-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                    <Lock size={16} aria-hidden="true" />
                                </div>
                                <button
                                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label={isVisible ? "Hide password" : "Show password"}
                                    aria-pressed={isVisible}
                                    aria-controls="password"
                                >
                                    {isVisible ? (
                                        <EyeOff size={16} aria-hidden="true" />
                                    ) : (
                                        <Eye size={16} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label
                                htmlFor="password_confirmation"
                                className="dark:text-zinc-200"
                            >
                                Confirm Password
                            </Label>
                            <div className="relative mt-2.5">
                                <Input
                                    id="password_confirmation"
                                    className="ps-9 pe-9"
                                    placeholder="Confirm your password"
                                    type={isVisibleConfirm ? "text" : "password"}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <div className="text-muted-foreground/80 dark:text-zinc-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                    <Lock size={16} aria-hidden="true" />
                                </div>
                                <button
                                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    type="button"
                                    onClick={toggleVisibilityConfirm}
                                    aria-label={isVisibleConfirm ? "Hide password" : "Show password"}
                                    aria-pressed={isVisibleConfirm}
                                    aria-controls="password_confirmation"
                                >
                                    {isVisibleConfirm ? (
                                        <EyeOff size={16} aria-hidden="true" />
                                    ) : (
                                        <Eye size={16} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="image" className="dark:text-zinc-200">
                                Profile Image (optional)
                            </Label>
                            <div className="flex items-end gap-4 mt-2.5">
                                {imagePreview && (
                                    <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                        <Image
                                            src={imagePreview}
                                            alt="Profile preview"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-2 w-full">
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full"
                                    />
                                    {imagePreview && (
                                        <X
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setImage(null);
                                                setImagePreview(null);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                                id="agree-terms"
                                checked={agreeTerms}
                                onCheckedChange={() => setAgreeTerms(!agreeTerms)}
                            />
                            <Label htmlFor="agree-terms" className="dark:text-zinc-200">
                                I agree to the{" "}
                                <a
                                    href="#"
                                    className="text-primary hover:underline"
                                >
                                    Terms & Conditions
                                </a>
                            </Label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !agreeTerms}
                        onClick={async () => {
                            if (process.env.NODE_ENV === "development") {
                                console.log(`Sign Up Attempt: Name: ${firstName} ${lastName}, Email: ${email}`);
                            }
                            await signUp.email({
                                email,
                                password,
                                name: `${firstName} ${lastName}`,
                                image: image ? await convertImageToBase64(image) : "",
                                callbackURL: "/dashboard",
                                fetchOptions: {
                                    onResponse: () => {
                                        if (process.env.NODE_ENV === "development") {
                                            console.log("[DEV] Sign up response received.");
                                        }
                                        setLoading(false);
                                    },
                                    onRequest: () => {
                                        if (process.env.NODE_ENV === "development") {
                                            console.log("[DEV] Signing up... (request sent)");
                                        }
                                        setLoading(true);
                                    },
                                    onError: (ctx) => {
                                        if (process.env.NODE_ENV === "development") {
                                            console.log(`[DEV] Sign up error: ${ctx.error?.message || "Unknown error"}`);
                                        }
                                        toast.error(ctx.error.message);
                                    },
                                    onSuccess: async () => {
                                        if (process.env.NODE_ENV === "development") {
                                            console.log("[DEV] Sign up successful! Redirecting to dashboard.");
                                        }
                                        router.push("/dashboard");
                                    },
                                },
                            });
                        }}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                Create an account
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <div className="text-center text-sm dark:text-zinc-400">
                        Already have an account?{" "}
                        <a
                            href="/auth/sign-in"
                            className="text-primary font-medium hover:underline dark:text-zinc-200"
                        >
                            Sign in
                        </a>
                    </div>
                </div>
                <ThemeToggle />
            </div>
        </div>
    );
}

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}