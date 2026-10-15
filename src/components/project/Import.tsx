"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    Slide,
    Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useTranslations } from "next-intl";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type ImportProps = {
    projectSlug: string;
};

export default function Import({ projectSlug }: ImportProps) {
    const t = useTranslations("project.import");
    const tNav = useTranslations("navigation");

    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = React.useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleClickOpen = () => {
        setError("");
        setOpen(true);
    };

    const handleClose = () => {
        if (loading) return;

        setOpen(false);
        setFiles([]);
        setError("");
    };

    const handleImport = async () => {
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();

            for (const file of files) {
                formData.append("files", file);
            }

            const response = await fetch(
                `/api/projects/${encodeURIComponent(projectSlug)}/import`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Failed to import translations");
            }

            console.log(data.results);
            setOpen(false);
            setFiles([]);
            setError("");

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not import translations. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    //DROPZONE
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((currentFiles) => {
            const newFiles = acceptedFiles.filter(
                (newFile) =>
                    !currentFiles.some(
                        (currentFile) =>
                            currentFile.name === newFile.name &&
                            currentFile.size === newFile.size,
                    ),
            );

            return [...currentFiles, ...newFiles];
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/json": [".json"],
        },
        multiple: true,
        disabled: loading,
    });

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                {t("import")}
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                slots={{ transition: Transition }}
                fullWidth
                maxWidth="sm"
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
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <DialogContentText>
                                {t("description")}
                            </DialogContentText>

                            <DialogContentText
                                variant="body2"
                                color="text.secondary"
                            >
                                {t("example")}{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                    }}
                                >
                                    pl_PL.json
                                </Box>
                                .
                            </DialogContentText>
                        </Box>
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: "2px dashed",
                                borderColor: isDragActive
                                    ? "primary.main"
                                    : "divider",
                                borderRadius: 2,
                                p: 4,
                                textAlign: "center",
                                cursor: "pointer",
                                bgcolor: isDragActive
                                    ? "action.hover"
                                    : "transparent",
                            }}
                        >
                            <input {...getInputProps()} />

                            <Typography>
                                {isDragActive
                                    ? t("dropActive")
                                    : t("dragAndDrop")}
                            </Typography>
                        </Box>
                        {files.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 300 }}
                                >
                                    {t("selected")}
                                </Typography>
                                <List
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                    }}
                                >
                                    {files.map((file, index) => (
                                        <ListItem
                                            key={`${file.name}-${index}`}
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    aria-label={`Remove ${file.name}`}
                                                    disabled={loading}
                                                    onClick={() =>
                                                        setFiles(
                                                            (currentFiles) =>
                                                                currentFiles.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index,
                                                                ),
                                                        )
                                                    }
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            }
                                            sx={{
                                                border: 1,
                                                borderColor: "divider",
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1,
                                            }}
                                        >
                                            <InsertDriveFileOutlinedIcon
                                                color="action"
                                                sx={{ mr: 1.5 }}
                                            />

                                            <Box sx={{ minWidth: 0, pr: 5 }}>
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                >
                                                    {file.name}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {(file.size / 1024).toFixed(
                                                        1,
                                                    )}{" "}
                                                    KB
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        {tNav("cancel")}
                    </Button>

                    <Button
                        onClick={handleImport}
                        variant="contained"
                        disabled={loading || files.length === 0}
                        endIcon={
                            loading ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                <UploadFileIcon />
                            )
                        }
                    >
                        {/* {loading ? "Importing..." : "Import JSON"} */}
                        {t("importJSON")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
