import { NextRequest } from "next/server";
import JSZip from "jszip";
import { auth } from "@/src/lib/auth";
import { getProject } from "@/src/lib/projects";
import { getExportData } from "@/src/lib/export";
import { headers } from "next/headers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ projectSlug: string }> },
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectSlug } = await params;
    const authorId = session.user.id;

    const project = await getProject(projectSlug, authorId);

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

    const exportData = await getExportData(projectSlug, authorId, languages);

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
