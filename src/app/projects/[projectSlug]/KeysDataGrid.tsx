"use client";

import { Chip } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    const columns: GridColDef<KeyRow>[] = [
        {
            field: "key",
            headerName: "Key",
            flex: 1,
        },
        {
            field: "sourceText",
            headerName: `Source (${sourceLanguage})`,
            flex: 1,
        },
        {
            field: "namespace",
            headerName: "Namespace",
            flex: 1,
        },
        {
            field: "languages",
            headerName: "Languages",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={params.value === "Translated" ? "success" : "error"}
                />
            ),
        },
    ];

    return (
        <DataGrid
            checkboxSelection
            columns={columns}
            rows={rows}
            disableRowSelectionOnClick
            localeText={{
                noRowsLabel: "No keys",
            }}
            onRowClick={(params) => {
                router.push(`/projects/${projectSlug}/keys/${params.row.id}`);
            }}
            sx={{
                "& .MuiDataGrid-row": {
                    cursor: "pointer",
                    userSelect: "none",
                },
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                    outline: "none",
                },
            }}
        />
    );
}
