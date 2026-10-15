"use client";

import { changePassword } from "@/src/actions/changePassword";
import SubmitButton from "@/src/components/forms/SubmitButton";
import { Alert, Box, Container, TextField, Typography } from "@mui/material";
import { useActionState, useState } from "react";

export default function ChangePasswordForm() {
    const [state, formAction, isPending] = useActionState(changePassword, {});
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

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
                Change Password
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
                                name="currentPassword"
                                id="current-password"
                                label="Current password"
                                variant="outlined"
                                required
                                type="password"
                                sx={{ width: "100%" }}
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(event.target.value)
                                }
                            />
                            <TextField
                                name="newPassword"
                                id="new-password"
                                label="New password"
                                variant="outlined"
                                required
                                type="password"
                                autoComplete="new-password"
                                sx={{ width: "100%" }}
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(event.target.value)
                                }
                            />
                            <TextField
                                name="confirmNewPassword"
                                id="confirm-new-password"
                                label="Confirm new password"
                                variant="outlined"
                                required
                                type="password"
                                autoComplete="new-password"
                                sx={{ width: "100%" }}
                                value={confirmNewPassword}
                                onChange={(event) =>
                                    setConfirmNewPassword(event.target.value)
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
                                    backgroundColor: "transparent",
                                }}
                            >
                                {state.error}
                            </Alert>
                        )}
                        {state.success && (
                            <Alert
                                severity="success"
                                sx={{
                                    py: 0,
                                    alignItems: "center",
                                    "& .MuiAlert-message": {
                                        py: 0.5,
                                    },
                                    backgroundColor: "transparent",
                                }}
                            >
                                {state.success}
                            </Alert>
                        )}

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "50%",
                            }}
                        >
                            <SubmitButton disabled={isPending}>
                                {isPending ? "Changing..." : "Change"}
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
