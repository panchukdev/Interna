"use client";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useState } from "react";

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

export default function KeysDataGrid({
    rows,
    sourceLanguage,
    projectSlug,
}: KeysDataGridProps) {
    const t = useTranslations("project.key");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [mobileColumn, setMobileColumn] = useState("key");

    const router = useRouter();

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
    ];

    console.log({ isMobile, mobileColumn });

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
        </>
    );
}
