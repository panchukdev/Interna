"use client";

import SubmitButton from "@/src/components/forms/SubmitButton";
import { getLanguageName, getLanguagePlaceholder } from "@/src/lib/languages";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { EditKey } from "@/src/actions/editKey";
import LocalDate from "@/src/components/LocalDate";

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

    const hasChanges =
        key !== keyData.key ||
        sourceText !== keyData.sourceText ||
        project.targetLanguages.some((lang) => {
            const originalTranslation =
                translations.find((item) => item.language === lang)?.text ?? "";

            return translationValues[lang] !== originalTranslation;
        });

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
                Edit translation key
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 300 }}
            >
                Change your translation key name, source language text or
                translations for target languages
            </Typography>

            <Container maxWidth="xl" disableGutters>
                {/* form + action={createKey*/}
                <form
                    action={EditKey.bind(
                        null,
                        keyData.id,
                        project.id,
                        project.slug,
                        project.targetLanguages,
                    )}
                >
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
                            Key
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            Enter a unique key to identify this text across your
                            project.
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
                                label="Translation key"
                                placeholder="hero.greetings"
                                variant="outlined"
                                required
                                sx={{ width: "100%" }}

                                value={key}
                                onChange={(event) => setKey(event.target.value)}
                            />
                            <Typography
                                variant="caption"
                                color="info"
                                sx={{ fontWeight: 300 }}
                            >
                                Created at:{" "}
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
                            Source language - {project.sourceLanguage} -{" "}
                            {sourceLanguageName}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            Enter a source text for your key.
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
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{ fontWeight: 500 }}
                        >
                            Target languages
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            Enter translations for each target language or use
                            DeepL AI for auto-translation.
                        </Typography>
                        <Box
                            sx={{
                                my: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
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
                                        {translation && (
                                            <Typography
                                                variant="caption"
                                                color="info"
                                                sx={{ fontWeight: 300 }}
                                            >
                                                Last updated:{" "}
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
                    <SubmitButton disabled={!hasChanges} endIcon={<SaveIcon />}>
                        Save changes
                    </SubmitButton>
                </form>
            </Container>
        </Container>
    );
}
