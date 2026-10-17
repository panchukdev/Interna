"use client";

import SubmitButton from "@/src/components/forms/SubmitButton";
import {
    Alert,
    Box,
    Container,
    Divider,
    TextField,
    Typography,
} from "@mui/material";
import { useActionState, useEffect, useState } from "react";
import { signIn } from "@/src/actions/signin";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { useTranslations } from "next-intl";
import LinkButton from "@/src/components/LinkButton";

export default function SignIn() {
    const {
        data: session,
        isPending: isSessionPending,
        refetch,
    } = authClient.useSession();

    const router = useRouter();
    const t = useTranslations("auth.signIn");
    const tNav = useTranslations("navigation");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [state, formAction, isPending] = useActionState(
        async (
            prevState: { error: string | null; success?: boolean },
            formData: FormData,
        ) => {
            const result = await signIn(prevState, formData);

            if (result.success) {
                await refetch();
                router.replace("/projects");
                router.refresh();
            }

            return result;
        },
        { error: null },
    );

    useEffect(() => {
        if (session) {
            router.replace("/projects");
        }
    }, [session, router]);

    if (isSessionPending || session) {
        return null;
    }

    const isFormInvalid = !email.trim() || !password;

    return (
        <Container
            disableGutters
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: { xs: "flex-start", md: "center" },
                mt: { xs: 4, md: 15 },
            }}
        >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
                {t("title")}
            </Typography>

            <Container maxWidth="xl" disableGutters>
                <form action={formAction}>
                    <Container
                        maxWidth="xl"
                        sx={{
                            my: 2,
                            py: 3,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                width: "100%",
                            }}
                        >
                            <TextField
                                name="email"
                                id="email"
                                label={t("email")}
                                variant="outlined"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="daryl@example.com"
                                sx={{ width: "100%" }}

                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />

                            <TextField
                                name="password"
                                id="password"
                                label={t("password")}
                                variant="outlined"
                                required
                                type="password"
                                autoComplete="new-password"
                                sx={{ width: "100%" }}

                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </Box>
                        {state.error && (
                            <Alert
                                severity="error"
                                sx={{
                                    py: 0,
                                    alignItems: "center",
                                    "& .MuiAlert-message": {
                                        py: 0.5,
                                    },
                                }}
                            >
                                {state.error}
                            </Alert>
                        )}

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: { xs: "100%", md: "50%" },
                            }}
                        >
                            <SubmitButton
                                disabled={isPending || isFormInvalid}
                                endIcon={<VpnKeyIcon />}
                            >
                                {/* {isPending ? "Signing in..." : "Sign In"} */}
                                {t("signInButton")}
                            </SubmitButton>
                        </Box>
                    </Container>
                </form>
            </Container>
            <Typography variant="body1" sx={{ fontWeight: 300 }}>
                * {t("required")}
            </Typography>
            <Box sx={{ width: "100%", my: 2 }}>
                <Divider />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 300 }}>
                    {t("signUpButton")}
                </Typography>
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                    <LinkButton href="/sign-up" variant="outlined" fullWidth>
                        <Typography
                            sx={{
                                textAlign: "center",
                                color: "white",
                                fontSize: { xs: 14, md: "1rem" },
                            }}
                        >
                            {tNav("signUp")}
                        </Typography>
                    </LinkButton>
                </Box>
            </Box>
        </Container>
    );
}
