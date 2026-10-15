"use client";

import SubmitButton from "@/src/components/forms/SubmitButton";
import {
    getLanguageName,
    getLanguagePlaceholder,
    type SupportedLocale,
} from "@/src/lib/languages";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { addKey } from "@/src/actions/addKey";
import { translateText } from "@/src/actions/translateText";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslations } from "next-intl";

export default function AddKeyForm({
    project,
}: {
    project: {
        id: number;
        title: string;
        slug: string;
        sourceLanguage: string;
        targetLanguages: readonly string[];
    };
}) {
    const t = useTranslations("project.addKey");

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

            setTranslations((prev) => ({
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
    const addKeyWithProject = addKey.bind(null, project.id, project.slug);

    const sourceLanguageName = getLanguageName(project.sourceLanguage);
    const targetLanguagesNames: string[] = [];

    for (const language of project.targetLanguages) {
        targetLanguagesNames.push(getLanguageName(language));
    }

    const [key, setKey] = useState("");
    const [sourceText, setSourceText] = useState("");
    const [translations, setTranslations] = useState<Record<string, string>>(
        {},
    );
    const [translating, setTranslating] = useState<string | null>(null);
    const [translatingAll, setTranslatingAll] = useState(false);

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
                {t("title")}
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 300 }}
            >
                {t("description")}
            </Typography>

            <Container maxWidth="xl" disableGutters>
                <form action={addKeyWithProject}>
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
                                gap: 2,
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
                            />
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
                                onChange={(event) => {
                                    setSourceText(event.target.value);
                                }}
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
                                gap: 2,
                            }}
                        >
                            {project.targetLanguages.map((lang) => (
                                <Box
                                    key={lang}
                                    sx={{ display: "flex", gap: 2 }}
                                >
                                    <TextField
                                        key={lang}
                                        name={lang}
                                        id={lang}
                                        label={`${lang} - ${getLanguageName(lang)}`}
                                        variant="outlined"

                                        value={translations[lang] ?? ""}
                                        onChange={(event) => {
                                            setTranslations((prev) => ({
                                                ...prev,
                                                [lang]: event.target.value,
                                            }));
                                        }}

                                        placeholder={getLanguagePlaceholder(
                                            lang,
                                        )}
                                        sx={{ width: "100%" }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleTranslate(lang)}
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
                            ))}
                        </Box>
                    </Container>
                    <SubmitButton
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                        disabled={
                            !key.trim() ||
                            !sourceText.trim() ||
                            translating !== null ||
                            translatingAll
                        }
                        endIcon={<AddIcon />}
                        size="large"
                    >
                        {t("addKeyButton")}
                    </SubmitButton>
                </form>
            </Container>
        </Container>
    );
}
