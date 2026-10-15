"use client";
import SubmitButton from "@/src/components/forms/SubmitButton";
import { Alert, Box, Container, TextField, Typography } from "@mui/material";
import { useActionState, useState } from "react";
import { signIn } from "@/src/actions/signin";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";

export default function SignIn() {
    const router = useRouter();
    const { refetch } = authClient.useSession();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isFormInvalid = !email.trim() || !password;

    const [state, formAction, isPending] = useActionState(
        async (
            prevState: { error: string | null; success?: boolean },
            formData: FormData,
        ) => {
            const result = await signIn(prevState, formData);

            if (result.success) {
                await refetch();
                router.push("/");
                router.refresh();
            }

            return result;
        },
        { error: null },
    );

    return (
        <Container
            disableGutters
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 15,
            }}
        >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
                Sign in to your account
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
                                label="Email"
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
                                label="Password"
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
                                width: "50%",
                            }}
                        >
                            <SubmitButton
                                disabled={isPending || isFormInvalid}
                                endIcon={<VpnKeyIcon />}
                            >
                                {isPending ? "Signing in..." : "Sign In"}
                            </SubmitButton>
                        </Box>
                    </Container>
                </form>
            </Container>
            <Typography variant="body1" sx={{ fontWeight: 300 }}>
                * Required fields
            </Typography>
        </Container>
    );
}
