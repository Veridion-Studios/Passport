import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [
        emailOTPClient()
    ]
});

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;

type ErrorTypes = Partial<
    Record<
        keyof typeof authClient.$ERROR_CODES,
        {
            en: string;
            es: string;
        }
    >
>;

const errorCodes = {
    USER_ALREADY_EXISTS: {
        en: "user already registered",
        es: "usuario ya registrado",
    },
} satisfies ErrorTypes;

export const getErrorMessage = (code: string, lang: "en" | "es") => {
    if (code in errorCodes) {
        return errorCodes[code as keyof typeof errorCodes][lang];
    }
    return "";
};

// --- FIXED getCurrentUser ---
export const getCurrentUser = async (): Promise<{ name: string; email: string } | null> => {
    try {
        const sessionResult = await authClient.getSession();
        if (
            sessionResult &&
            "data" in sessionResult &&
            sessionResult.data &&
            sessionResult.data.user
        ) {
            return {
                name: sessionResult.data.user.name ?? "",
                email: sessionResult.data.user.email ?? "",
            };
        }
        return null;
    } catch {
        return null;
    }
};

export type CurrentUser = {
    name: string;
    email: string;
};