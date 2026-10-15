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
import { createProject } from "@/src/actions/project";
import SubmitButton from "@/src/components/forms/SubmitButton";
import { supportedLocales, getLanguageName } from "@/src/lib/languages";
import { useTranslations } from "next-intl";

export default function CreateProjectForm({ userId }) {
    const t = useTranslations("create");

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
                {/* form */}
                <form action={createProject.bind(null, userId)}>
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
                            {t("details.title")}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            {t("details.description")}
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
                                label={t("details.projectName.title")}
                                variant="outlined"
                                required
                                placeholder={t(
                                    "details.projectName.placeholder",
                                )}
                                sx={{ width: "100%" }}

                                value={projectName}
                                onChange={(event) =>
                                    setProjectName(event.target.value)
                                }
                            />
                            <TextField
                                name="websiteURL"
                                id="website-url"
                                label={t("details.website")}
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
                            {t("languages.title")}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            {t("languages.description")}
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
                                    {t("languages.sourceLanguage")}
                                </InputLabel>

                                <Select
                                    name="sourceLanguage"
                                    labelId="source-language-label"
                                    id="source-language"
                                    value={sourceLanguage}
                                    label={t("languages.sourceLanguage")}
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
                                    {t("languages.targetLanguage")}
                                </InputLabel>

                                <Select
                                    labelId="target-language-label"
                                    id="target-language"
                                    value={targetLanguage}
                                    label={t("languages.targetLanguage")}
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
                                            {t("languages.noTarget")}
                                        </Typography>
                                        {targetLanguagesError && (
                                            <Typography
                                                color="error"
                                                variant="body2"
                                            >
                                                {t("languages.noTargetError")}
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
                            {t("import.title")}
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
                            label={t("import.label")}
                        />

                        {/* hidden checkbox state for formData */}
                        <input
                            type="hidden"
                            name="initialContent"
                            value={String(initialContent)}
                        />

                        <Typography variant="body1" sx={{ fontWeight: 300 }}>
                            {t("import.description")}
                        </Typography>
                    </Container>
                    <Typography variant="body1" sx={{ fontWeight: 300 }}>
                        * {t("required")}
                    </Typography>

                    <Box sx={{ my: 2 }}>
                        <SubmitButton endIcon={<AddCircleIcon />}>
                            {t("create")}
                        </SubmitButton>
                    </Box>
                </form>
            </Container>
        </Container>
    );
}
