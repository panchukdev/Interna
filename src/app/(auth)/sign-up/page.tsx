"use client";
import SubmitButton from "@/src/components/forms/SubmitButton";
import { Alert, Box, Container, TextField, Typography } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useActionState, useState } from "react";
import { signup } from "@/src/actions/signup";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const isFormInvalid =
        !email.trim() ||
        !name.trim() ||
        !password ||
        !passwordConfirm ||
        password !== passwordConfirm;

    const [state, formAction, isPending] = useActionState(signup, {
        error: null,
    });

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
                Create new account
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
                                name="name"
                                id="name"
                                label="Name"
                                variant="outlined"
                                required
                                type="text"
                                autoComplete="name"
                                placeholder="Daryl Dixon"
                                sx={{ width: "100%" }}

                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
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
                            <TextField
                                name="passwordConfirm"
                                id="password-confirm"
                                label="Confirm password"
                                variant="outlined"
                                required
                                type="password"
                                autoComplete="new-password"
                                sx={{ width: "100%" }}

                                value={passwordConfirm}
                                onChange={(event) =>
                                    setPasswordConfirm(event.target.value)
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
                                endIcon={<PersonAddAlt1Icon />}
                            >
                                {isPending ? "Creating account..." : "Sign Up"}
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
