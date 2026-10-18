import { getProject } from "@/src/lib/projects";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getLanguageName } from "@/src/lib/languages";
import AddIcon from "@mui/icons-material/Add";
import LinkButton from "@/src/components/LinkButton";
import { getKeys } from "@/src/lib/keys";
import KeysDataGrid from "./KeysDataGrid";
import { getProjectTranslations } from "@/src/lib/translations";
import Export from "@/src/components/project/Export";
import Import from "@/src/components/project/Import";
import DeleteProject from "@/src/components/project/Delete";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ projectSlug: string }>;
}): Promise<Metadata> {
    const { projectSlug } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return {};
    }

    const project = await getProject(projectSlug, session.user.id);

    if (!project) {
        return {};
    }

    return {
        title: project.title,
    };
}

export default async function Project({
    params,
}: {
    params: Promise<{ projectSlug: string }>;
}) {
    const t = await getTranslations("project");

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
            const translations = await getProjectTranslations(key.id);

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
                        gap: 2,
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", lg: "flex-end" },
                        flexDirection: { xs: "column", lg: "row" },
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
                            {t("sourceLanguage")}: {sourceLanguage} (
                            {project.sourceLanguage})
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                            flexDirection: { xs: "column", md: "row" },
                            flexWrap: { xs: "nowrap", md: "wrap" },
                            alignItems: { xs: "stretch", md: "center" },
                            width: { xs: "100%", md: "auto" },
                        }}
                    >
                        <DeleteProject
                            projectSlug={project.slug}
                            projectTitle={project.title}
                        />

                        <Import projectSlug={project.slug} />

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
                            {t("addKey.addKeyButton")}
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
