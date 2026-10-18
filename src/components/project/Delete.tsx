"use client";

import { deleteProject } from "@/src/actions/deleteProject";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProject({
    projectSlug,
    projectTitle,
}: {
    projectSlug: string;
    projectTitle: string;
}) {
    const t = useTranslations("project.deleteProject");
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => {
        if (deleting) return;

        setOpen(false);
        setError("");
    };

    const handleDelete = async () => {
        if (deleting) return;

        setDeleting(true);
        setError("");

        try {
            const result = await deleteProject(projectSlug);

            if (result.error) {
                setError(t("error"));
                return;
            }

            router.replace("/projects");
            router.refresh();
        } catch {
            setError(t("error"));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={() => {
                    setError("");
                    setOpen(true);
                }}
            >
                {t("button")}
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{t("title")}</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        {t("description", { project: projectTitle })}
                    </DialogContentText>

                    {error && (
                        <DialogContentText color="error" sx={{ mt: 2 }}>
                            {error}
                        </DialogContentText>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} disabled={deleting}>
                        {t("cancel")}
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={deleting}
                        endIcon={
                            deleting ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                <DeleteForeverIcon />
                            )
                        }
                    >
                        {t("confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
