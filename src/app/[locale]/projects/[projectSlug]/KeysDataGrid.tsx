"use client";

import * as React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteKey } from "@/src/actions/deleteKey";
import { useState } from "react";
import {
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    useMediaQuery,
    useTheme,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";

type KeyRow = {
    id: number;
    key: string;
    sourceText: string;
    namespace: string;
    languages: string;
    status: "Translated" | "Untranslated";
};

type KeysDataGridProps = {
    rows: KeyRow[];
    sourceLanguage: string;
    projectSlug: string;
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function KeysDataGrid({
    rows,
    sourceLanguage,
    projectSlug,
}: KeysDataGridProps) {
    const t = useTranslations("project.key");
    const tNav = useTranslations("navigation");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [mobileColumn, setMobileColumn] = useState("key");

    const router = useRouter();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<KeyRow | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleOpenDelete = (row: KeyRow) => {
        setSelectedKey(row);
        setDeleteError("");
        setDeleteDialogOpen(true);
    };

    const handleCloseDelete = () => {
        if (deleting) return;

        setDeleteDialogOpen(false);
        setSelectedKey(null);
        setDeleteError("");
    };

    const handleDelete = async () => {
        if (!selectedKey) return;

        setDeleting(true);
        setDeleteError("");

        try {
            const result = await deleteKey(selectedKey.id, projectSlug);

            if (result.error) {
                setDeleteError(t("deleteError"));
                return;
            }

            setDeleteDialogOpen(false);
            setSelectedKey(null);
            router.refresh();
        } catch {
            setDeleteError(t("error"));
        } finally {
            setDeleting(false);
        }
    };

    const columns: GridColDef<KeyRow>[] = [
        {
            field: "key",
            headerName: t("key"),
            flex: 1,
        },
        {
            field: "sourceText",
            headerName: `${t("source")} (${sourceLanguage})`,
            flex: 1,
        },
        {
            field: "namespace",
            headerName: t("namespace"),
            flex: 1,
        },
        {
            field: "languages",
            headerName: t("languages"),
            flex: 1,
        },
        {
            field: "status",
            headerName: t("status"),
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={
                        params.value === "Translated"
                            ? t("translated")
                            : t("untranslated")
                    }
                    size="small"
                    color={params.value === "Translated" ? "primary" : "error"}
                />
            ),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "",
            width: 60,
            getActions: (params) => [
                <GridActionsCellItem
                    key="delete"
                    icon={<DeleteForeverIcon sx={{ color: "error.main" }} />}
                    label={t("delete")}
                    onClick={(event) => {
                        event.stopPropagation();
                        handleOpenDelete(params.row);
                    }}
                    showInMenu={false}
                />,
            ],
        },
    ];

    return (
        <>
            {isMobile && (
                <FormControl fullWidth size="small">
                    <InputLabel id="mobile-column-label">
                        {t("showColumn")}
                    </InputLabel>

                    <Select
                        labelId="mobile-column-label"
                        value={mobileColumn}
                        label={t("showColumn")}
                        onChange={(event) =>
                            setMobileColumn(event.target.value)
                        }
                    >
                        {columns.map((column) => (
                            <MenuItem key={column.field} value={column.field}>
                                {column.headerName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <>
                <DataGrid
                    checkboxSelection
                    columns={columns}
                    rows={rows}
                    disableRowSelectionOnClick
                    columnVisibilityModel={
                        isMobile
                            ? {
                                  key: mobileColumn === "key",
                                  sourceText: mobileColumn === "sourceText",
                                  namespace: mobileColumn === "namespace",
                                  languages: mobileColumn === "languages",
                                  status: mobileColumn === "status",
                              }
                            : undefined
                    }
                    localeText={{
                        noRowsLabel: t("noKeys"),
                    }}
                    onRowClick={(params) => {
                        router.push(
                            `/projects/${projectSlug}/keys/${params.row.id}`,
                        );
                    }}
                    sx={{
                        "& .MuiDataGrid-row": {
                            cursor: "pointer",
                            userSelect: "none",
                        },
                        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within":
                            {
                                outline: "none",
                            },
                    }}
                />
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleCloseDelete}
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
                    <DialogTitle>{t("deleteTitle")}</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            {t("deleteDescription")}
                        </DialogContentText>

                        {deleteError && (
                            <DialogContentText color="error" sx={{ mt: 2 }}>
                                {deleteError}
                            </DialogContentText>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCloseDelete} disabled={deleting}>
                            {tNav("cancel")}
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            disabled={deleting || !selectedKey}
                            endIcon={
                                deleting ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <DeleteForeverIcon />
                                )
                            }
                        >
                            {t("deleteConfirm")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        </>
    );
}
