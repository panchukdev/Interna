"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import DownloadIcon from "@mui/icons-material/Download";
import { useTranslations } from "next-intl";

type ExportProps = {
    projectSlug: string;
    languages: string[];
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Export({ projectSlug, languages }: ExportProps) {
    const t = useTranslations("project.export");
    const tNav = useTranslations("navigation");

    const [open, setOpen] = React.useState(false);
    const [selectedLanguages, setSelectedLanguages] =
        React.useState<string[]>(languages);

    const handleClose = () => {
        setOpen(false);
    };

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleExport = async () => {
        setLoading(true);
        setError("");

        try {
            const query = new URLSearchParams({
                languages: selectedLanguages.join(","),
            });

            const response = await fetch(
                `/api/projects/${encodeURIComponent(projectSlug)}/export?${query}`,
            );

            if (!response.ok) {
                throw new Error("Failed to export translations");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `${projectSlug}-locales.zip`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => URL.revokeObjectURL(url), 1000);
            handleClose();
        } catch {
            setError("Could not export translations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguages((current) =>
            current.includes(language)
                ? current.filter((item) => item !== language)
                : [...current, language],
        );
    };

    return (
        <>
            <Button variant="outlined" onClick={() => setOpen(true)}>
                {t("export")}
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                slots={{ transition: Transition }}
                sx={{
                    "& .MuiDialogTitle-root": {
                        px: 3,
                        pt: 2,
                    },
                    "& .MuiDialogContent-root": {
                        px: 3,
                    },
                    "& .MuiDialogActions-root": {
                        px: 3,
                        pb: 2,
                    },
                }}
            >
                <DialogTitle>{t("title")}</DialogTitle>

                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <DialogContentText>
                            {t("description")}
                        </DialogContentText>

                        <FormGroup>
                            {languages.map((language) => (
                                <FormControlLabel
                                    key={language}
                                    control={
                                        <Checkbox
                                            checked={selectedLanguages.includes(
                                                language,
                                            )}
                                            onChange={() =>
                                                handleLanguageChange(language)
                                            }
                                        />
                                    }
                                    label={language.toUpperCase()}
                                />
                            ))}
                        </FormGroup>
                        {error && (
                            <DialogContentText color="error" sx={{ mt: 2 }}>
                                {error}
                            </DialogContentText>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        {tNav("cancel")}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleExport}
                        disabled={selectedLanguages.length === 0 || loading}
                        endIcon={
                            loading ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                <DownloadIcon />
                            )
                        }
                    >
                        {t("exportJSON")}
                        {/* {loading ? "Exporting..." : t("exportJSON")} */}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
