"use client";

import SubmitButton from "@/src/components/forms/SubmitButton";
import {
    getLanguageName,
    getLanguagePlaceholder,
    type SupportedLocale,
} from "@/src/lib/languages";
import { useState, useActionState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { editKey, type EditKeyState } from "@/src/actions/editKey";
import LocalDate from "@/src/components/LocalDate";
import { translateText } from "@/src/actions/translateText";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslations } from "next-intl";
import { deleteKey } from "@/src/actions/deleteKey";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function EditKeyForm({
    project,
    keyData,
    translations,
}: {
    project: {
        id: number;
        title: string;
        slug: string;
        sourceLanguage: string;
        targetLanguages: readonly string[];
    };
    keyData: {
        id: number;
        createdAt: string;
        updatedAt: string;
        key: string;
        sourceText: string;
    };
    translations: {
        updatedAt: string;
        language: string;
        text: string;
    }[];
}) {
    const t = useTranslations("project.addKey");
    const tE = useTranslations("error.key");

    const tDelete = useTranslations("project.key");
    const tNav = useTranslations("navigation");
    const router = useRouter();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleCloseDelete = () => {
        if (deleting) return;

        setDeleteDialogOpen(false);
        setDeleteError("");
    };

    const handleDelete = async () => {
        setDeleting(true);
        setDeleteError("");

        try {
            const result = await deleteKey(keyData.id, project.slug);

            if (result.error) {
                setDeleteError(tDelete("deleteError"));
                return;
            }

            router.push(`/projects/${project.slug}`);
            router.refresh();
        } catch {
            setDeleteError(tDelete("deleteError"));
        } finally {
            setDeleting(false);
        }
    };

    async function handleTranslateAll() {
        if (!sourceText.trim()) return;

        try {
            setTranslatingAll(true);

            for (const language of project.targetLanguages) {
                await handleTranslate(language);
            }
        } catch (error) {
            throw new Error("Error during translating all target languages.", {
                cause: error,
            });
        } finally {
            setTranslatingAll(false);
        }
    }

    async function handleTranslate(language: string) {
        if (!sourceText.trim()) return;

        try {
            setTranslating(language);

            const translatedText = await translateText(
                sourceText,
                language as SupportedLocale,
            );

            setTranslationValues((prev) => ({
                ...prev,
                [language]: translatedText,
            }));
        } catch (error) {
            throw new Error("Error during translating target language.", {
                cause: error,
            });
        } finally {
            setTranslating(null);
        }
    }
    const sourceLanguageName = getLanguageName(project.sourceLanguage);

    const [key, setKey] = useState(keyData.key);
    const [sourceText, setSourceText] = useState(keyData.sourceText);

    const [translationValues, setTranslationValues] = useState<
        Record<string, string>
    >(() =>
        Object.fromEntries(
            project.targetLanguages.map((lang) => {
                const translation = translations.find(
                    (item) => item.language === lang,
                );

                return [lang, translation?.text ?? ""];
            }),
        ),
    );

    const [translating, setTranslating] = useState<string | null>(null);
    const [translatingAll, setTranslatingAll] = useState(false);

    const hasChanges =
        key !== keyData.key ||
        sourceText !== keyData.sourceText ||
        project.targetLanguages.some((lang) => {
            const originalTranslation =
                translations.find((item) => item.language === lang)?.text ?? "";

            return translationValues[lang] !== originalTranslation;
        });

    const editKeyWithId = editKey.bind(null, keyData.id, project.slug);
    const [state, formAction] = useActionState<EditKeyState, FormData>(
        editKeyWithId,
        {},
    );

    return (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
                {t("titleEdit")}
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 300 }}
            >
                {t("descriptionEdit")}
            </Typography>

            <Container maxWidth="xl" disableGutters>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                        mt: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        onClick={() => {
                            setDeleteError("");
                            setDeleteDialogOpen(true);
                        }}
                    >
                        {tDelete("delete")}
                    </Button>
                </Box>
                {/* form + action={createKey*/}
                <form action={formAction}>
                    <Container
                        maxWidth="xl"
                        sx={{
                            my: 2,
                            py: 2,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{ fontWeight: 500 }}
                        >
                            {t("key.title")}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            {t("key.description")}
                        </Typography>
                        <Box
                            sx={{
                                my: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <TextField
                                name="key"
                                id="key"
                                label={t("key.label")}
                                placeholder="hero.greetings"
                                variant="outlined"
                                required
                                sx={{ width: "100%" }}
                                value={key}
                                onChange={(event) => setKey(event.target.value)}
                                error={
                                    state.error === "duplicate" ||
                                    state.error === "pathConflict"
                                }
                                helperText={
                                    state.error === "duplicate"
                                        ? tE("duplicate")
                                        : state.error === "pathConflict"
                                          ? tE("pathConflict")
                                          : undefined
                                }
                            />
                            <Typography
                                variant="caption"
                                sx={{ fontWeight: 300, color: "primary.main" }}
                            >
                                {t("date.created")}{" "}
                                <LocalDate date={keyData.createdAt} />
                            </Typography>
                        </Box>
                    </Container>

                    {/* source language */}
                    <Container
                        maxWidth="xl"
                        sx={{
                            my: 2,
                            py: 2,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{ fontWeight: 500 }}
                        >
                            {t("source.title")} - {project.sourceLanguage} -{" "}
                            {sourceLanguageName}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            {t("source.description")}
                        </Typography>
                        <Box
                            sx={{
                                my: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <TextField
                                name="sourceText"
                                id="source-text"
                                label={`${project.sourceLanguage} - ${sourceLanguageName}`}
                                placeholder={getLanguagePlaceholder(
                                    project.sourceLanguage,
                                )}
                                variant="outlined"
                                required
                                sx={{ width: "100%" }}
                                value={sourceText}
                                onChange={(event) =>
                                    setSourceText(event.target.value)
                                }
                            />
                        </Box>
                    </Container>

                    {/* target languages */}
                    <Container
                        maxWidth="xl"
                        sx={{
                            my: 2,
                            py: 2,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: { xs: "column", md: "row" },
                                gap: { xs: 1 },
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    sx={{ fontWeight: 500 }}
                                >
                                    {t("target.title")}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ fontWeight: 300 }}
                                >
                                    {t("target.description")}
                                </Typography>
                            </Box>
                            <Button
                                type="button"
                                size="small"
                                variant="contained"
                                onClick={handleTranslateAll}
                                endIcon={
                                    translatingAll ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <AutoAwesomeIcon />
                                    )
                                }
                                disabled={
                                    !sourceText.trim() ||
                                    translating !== null ||
                                    translatingAll
                                }
                            >
                                {t("target.translateAllButton")}
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                my: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                            }}
                        >
                            {project.targetLanguages.map((lang) => {
                                const translation = translations.find(
                                    (item) => item.language === lang,
                                );
                                return (
                                    <Box
                                        key={lang}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                key={lang}
                                                name={lang}
                                                id={lang}
                                                label={`${lang} - ${getLanguageName(lang)}`}
                                                variant="outlined"

                                                placeholder={getLanguagePlaceholder(
                                                    lang,
                                                )}
                                                sx={{ width: "100%" }}
                                                value={translationValues[lang]}
                                                onChange={(event) => {
                                                    setTranslationValues(
                                                        (previous) => ({
                                                            ...previous,
                                                            [lang]: event.target
                                                                .value,
                                                        }),
                                                    );
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    handleTranslate(lang)
                                                }
                                                sx={{ px: 2 }}
                                                endIcon={
                                                    translating === lang ||
                                                    translatingAll ? (
                                                        <CircularProgress
                                                            size={18}
                                                            color="inherit"
                                                        />
                                                    ) : (
                                                        <AutoAwesomeIcon />
                                                    )
                                                }
                                                disabled={
                                                    !sourceText.trim() ||
                                                    translating !== null ||
                                                    translatingAll
                                                }
                                            >
                                                {t("target.translateButton")}
                                            </Button>
                                        </Box>

                                        {translation && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 300,
                                                    color: "primary.main",
                                                }}
                                            >
                                                {t("date.updated")}{" "}
                                                <LocalDate
                                                    date={translation.updatedAt}
                                                />
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Container>
                    <SubmitButton
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                        disabled={
                            !hasChanges ||
                            translating !== null ||
                            translatingAll
                        }
                        endIcon={<SaveIcon />}
                        size="large"
                    >
                        {t("saveChangesButton")}
                    </SubmitButton>
                </form>

                {/* delete key */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleCloseDelete}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>{tDelete("deleteTitle")}</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            {tDelete("deleteDescription", {
                                key: keyData.key,
                            })}
                        </DialogContentText>

                        {deleteError && (
                            <DialogContentText color="error" sx={{ mt: 2 }}>
                                {deleteError}
                            </DialogContentText>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleCloseDelete} disabled={deleting}>
                            {tNav("cancel")}
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            disabled={deleting}
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
                            {tDelete("deleteConfirm")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Container>
    );
}
