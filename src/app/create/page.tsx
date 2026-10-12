"use client";

import {
    Box,
    Container,
    MenuItem,
    Select,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Chip,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import { createProject } from "../../actions/project";
import SubmitButton from "@/src/components/forms/SubmitButton";
import { supportedLocales, getLanguageName } from "@/src/lib/languages";

export default function Create() {
    const [projectName, setProjectName] = useState<string | undefined>("");
    const [websiteURL, setwebsiteURL] = useState<string | undefined>("");
    const [initialContent, setInitialContent] = useState<boolean>(false);
    const [sourceLanguage, setSourceLanguage] = useState<string>(
        supportedLocales[0],
    );
    const [targetLanguage, setTargetLanguage] = useState<string>("");
    const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
    const [targetLanguagesError, setTargetLanguagesError] = useState(false);

    return (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
                Create project
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 300 }}
            >
                Set up a translation space for your website
            </Typography>

            <Container maxWidth="xl" disableGutters>
                {/* form */}
                <form action={createProject}>
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
                            Project details
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            Give your project a recognizable name and website
                            reference.
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
                                name="projectName"
                                id="project-name"
                                label="Project name"
                                variant="outlined"
                                required
                                placeholder="Personal website"
                                sx={{ width: "100%" }}

                                value={projectName}
                                onChange={(event) =>
                                    setProjectName(event.target.value)
                                }
                            />
                            <TextField
                                name="websiteURL"
                                id="website-url"
                                label="Website URL"
                                variant="outlined"
                                placeholder="https://panchuk.dev"
                                sx={{ width: "100%" }}

                                value={websiteURL}
                                onChange={(event) =>
                                    setwebsiteURL(event.target.value)
                                }
                            />
                        </Box>
                    </Container>
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
                            Languages
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            Your source language is the reference for every
                            translation.
                        </Typography>
                        <Box
                            sx={{
                                my: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {/* source */}
                            <FormControl fullWidth required>
                                <InputLabel id="source-language-label">
                                    Source Language
                                </InputLabel>

                                <Select
                                    name="sourceLanguage"
                                    labelId="source-language-label"
                                    id="source-language"
                                    value={sourceLanguage}
                                    label="Source Language"
                                    onChange={(event) => {
                                        const language = event.target.value;

                                        setSourceLanguage(language);

                                        setTargetLanguages((prevLanguages) =>
                                            prevLanguages.filter(
                                                (lang) => lang !== language,
                                            ),
                                        );
                                    }}
                                >
                                    {supportedLocales.map((code) => (
                                        <MenuItem key={code} value={code}>
                                            {getLanguageName(code)} — {code}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* target */}
                            <FormControl fullWidth>
                                <InputLabel id="target-language-label">
                                    Target language
                                </InputLabel>

                                <Select
                                    labelId="target-language-label"
                                    id="target-language"
                                    value={targetLanguage}
                                    label="Target Language"
                                    onChange={(event) => {
                                        const language = event.target.value;
                                        setTargetLanguage(language);

                                        setTargetLanguages((prevLanguages) => {
                                            return prevLanguages.includes(
                                                language,
                                            )
                                                ? prevLanguages
                                                : [...prevLanguages, language];
                                        });
                                    }}
                                >
                                    {supportedLocales
                                        .filter(
                                            (code) => code !== sourceLanguage,
                                        )
                                        .map((code) => (
                                            <MenuItem key={code} value={code}>
                                                {getLanguageName(code)} — {code}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            {/* hidden target languages for formData */}
                            {targetLanguages.map((language) => {
                                return (
                                    <input
                                        type="hidden"
                                        key={language}
                                        name="targetLanguages"
                                        value={language}
                                    />
                                );
                            })}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                {targetLanguages.length === 0 ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ fontWeight: 300 }}
                                        >
                                            No target languages selected yet.
                                        </Typography>
                                        {targetLanguagesError && (
                                            <Typography
                                                color="error"
                                                variant="body2"
                                            >
                                                Select at least one target
                                                language.
                                            </Typography>
                                        )}
                                    </Box>
                                ) : (
                                    targetLanguages.map((language) => (
                                        <Chip
                                            variant="outlined"
                                            key={language}
                                            label={language}
                                            onDelete={() => {
                                                setTargetLanguages(
                                                    (prevLanguages) =>
                                                        prevLanguages.filter(
                                                            (lang) =>
                                                                lang !==
                                                                language,
                                                        ),
                                                );
                                            }}
                                        />
                                    ))
                                )}
                            </Box>
                        </Box>
                    </Container>
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
                            Initial content
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={initialContent}
                                    onChange={() =>
                                        setInitialContent(
                                            (prevValue) => !prevValue,
                                        )
                                    }
                                />
                            }
                            label="Import translations after creating this project"
                        />

                        {/* hidden checkbox state for formData */}
                        <input
                            type="hidden"
                            name="initialContent"
                            value={String(initialContent)}
                        />

                        <Typography variant="body1" sx={{ fontWeight: 300 }}>
                            Upload JSON files in the next step.
                        </Typography>
                    </Container>
                    <Typography variant="body1" sx={{ fontWeight: 300 }}>
                        * Required fields
                    </Typography>

                    <Box sx={{ my: 2 }}>
                        <SubmitButton endIcon={<AddCircleIcon />}>
                            Create
                        </SubmitButton>
                    </Box>
                </form>
            </Container>
        </Container>
    );
}
