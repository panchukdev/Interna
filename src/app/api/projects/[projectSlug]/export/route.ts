import { NextRequest } from "next/server";
import JSZip from "jszip";
import { getProject } from "@/src/lib/projects";
import { getExportData } from "@/src/lib/export";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ projectSlug: string }> },
) {
    const { projectSlug } = await params;

    const project = await getProject(projectSlug);

    if (!project) {
        return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const requestedLanguages = request.nextUrl.searchParams
        .get("languages")
        ?.split(",")
        .filter(Boolean);

    if (!requestedLanguages?.length) {
        return Response.json(
            { error: "Select at least one language" },
            { status: 400 },
        );
    }

    const availableLanguages = [
        project.sourceLanguage,
        ...project.targetLanguages,
    ];

    const languages = [...new Set(requestedLanguages)];

    if (languages.some((language) => !availableLanguages.includes(language))) {
        return Response.json(
            { error: "Invalid language selection" },
            { status: 400 },
        );
    }

    const exportData = await getExportData(projectSlug, languages);

    const zip = new JSZip();

    for (const language of languages) {
        zip.file(
            `${language}.json`,
            JSON.stringify(exportData[language], null, 4),
        );
    }

    const archive = await zip.generateAsync({
        type: "blob",
    });

    return new Response(archive, {
        headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${project.slug}-locales.zip"`,
            "Cache-Control": "no-store",
        },
    });
}
