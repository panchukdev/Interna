"use client";

import SubmitButton from "@/src/components/forms/SubmitButton";
import {
    getLanguageName,
    getLanguagePlaceholder,
} from "../../../../lib/languages";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { addKey } from "@/src/actions/addKey";

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
    const addKeyWithProject = addKey.bind(
        null,
        project.id,
        project.slug,
        project.targetLanguages,
    );

    const sourceLanguageName = getLanguageName(project.sourceLanguage);
    const targetLanguagesNames: string[] = [];

    for (const language of project.targetLanguages) {
        targetLanguagesNames.push(getLanguageName(language));
    }

    const [key, setKey] = useState("");

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
                Add translation key
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 300 }}
            >
                Create a new translation key with source text and translations
                in your target languages.
            </Typography>

            <Container maxWidth="xl" disableGutters>
                {/* form + action={createKey*/}
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
                                gap: 2,
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
                            {project.targetLanguages.map((lang) => (
                                <TextField
                                    key={lang}
                                    name={lang}
                                    id={lang}
                                    label={`${lang} - ${getLanguageName(lang)}`}
                                    variant="outlined"

                                    placeholder={getLanguagePlaceholder(lang)}
                                    sx={{ width: "100%" }}

                                    // value={key}
                                    // onChange={(event) => setKey(event.target.value)}
                                />
                            ))}
                        </Box>
                    </Container>
                    <SubmitButton endIcon={<AddIcon />}>Add</SubmitButton>
                </form>
            </Container>
        </Container>
    );
}
