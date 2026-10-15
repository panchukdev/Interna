import { getProject } from "@/src/lib/projects";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getLanguageName } from "@/src/lib/languages";
import AddIcon from "@mui/icons-material/Add";
import LinkButton from "@/src/components/LinkButton";
import { getKeys } from "@/src/lib/keys";
import KeysDataGrid from "./KeysDataGrid";
import { getTranslations } from "@/src/lib/translations";
import Export from "@/src/components/project/Export";
import Import from "@/src/components/project/Import";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export default async function Project({
    params,
}: {
    params: Promise<{ projectSlug: string }>;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const { projectSlug } = await params;
    const project = await getProject(projectSlug, session.user.id);

    if (!project) {
        notFound();
    }

    const sourceLanguage = getLanguageName(project.sourceLanguage);

    const keys = await getKeys(project.id);

    const targetLanguages = project.targetLanguages;

    const rows = await Promise.all(
        keys.map(async (key) => {
            const translations = await getTranslations(key.id);

            const translatedLanguages = new Set(
                translations
                    .filter(
                        (translation) =>
                            translation.text !== null &&
                            translation.text.trim() !== "",
                    )
                    .map((translation) => translation.language),
            );

            const translatedCount = targetLanguages.filter((language) =>
                translatedLanguages.has(language),
            ).length;

            return {
                id: key.id,
                key: key.key,
                sourceText: key.sourceText,
                namespace: key.key.split(".")[0],
                languages: `${translatedCount}/${targetLanguages.length}`,
                status:
                    translatedCount === targetLanguages.length
                        ? ("Translated" as const)
                        : ("Untranslated" as const),
            };
        }),
    );

    return (
        <Container disableGutters maxWidth={false}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{ fontWeight: 600 }}
                >
                    {project.title}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "space-between",
                        }}
                    >
                        {project.websiteUrl && (
                            <>
                                <Link
                                    href={project.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ fontWeight: 300 }}
                                    >
                                        {project.websiteUrl}
                                    </Typography>
                                </Link>
                                ·
                            </>
                        )}

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontWeight: 300 }}
                        >
                            Source language: {sourceLanguage} (
                            {project.sourceLanguage})
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "space-between",
                        }}
                    >
                        {/* import */}
                        <Import projectSlug={project.slug} />
                        {/* export */}
                        <Export
                            projectSlug={project.slug}
                            languages={[
                                project.sourceLanguage,
                                ...project.targetLanguages,
                            ]}
                        />
                        <LinkButton
                            variant="contained"
                            href={`/projects/${project.slug}/add-key`}
                            endIcon={<AddIcon />}
                        >
                            Add key
                        </LinkButton>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
                <KeysDataGrid
                    rows={rows}
                    sourceLanguage={project.sourceLanguage}
                    projectSlug={project.slug}
                />
            </Box>
        </Container>
    );
}
