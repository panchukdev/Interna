import { NextRequest } from "next/server";
import { getProject } from "@/src/lib/projects";
import { importTranslations } from "@/src/lib/import";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ projectSlug: string }> },
) {
    try {
        const { projectSlug } = await params;

        const project = await getProject(projectSlug);

        if (!project) {
            return Response.json(
                { error: "Project not found" },
                { status: 404 },
            );
        }

        const formData = await request.formData();
        const files = formData.getAll("files");

        if (files.length === 0) {
            return Response.json(
                { error: "Select at least one JSON file" },
                { status: 400 },
            );
        }

        const availableLanguages = [
            project.sourceLanguage,
            ...project.targetLanguages,
        ];

        const seenLanguages = new Set<string>();
        const importItems: { language: string; data: unknown }[] = [];

        for (const file of files) {
            if (!(file instanceof File)) {
                return Response.json(
                    { error: "Invalid file upload" },
                    { status: 400 },
                );
            }

            if (!file.name.toLowerCase().endsWith(".json")) {
                return Response.json(
                    { error: `File "${file.name}" must be a JSON file` },
                    { status: 400 },
                );
            }

            const language = file.name.slice(0, -5);

            if (!availableLanguages.includes(language)) {
                return Response.json(
                    {
                        error: `Language "${language}" from "${file.name}" is not part of this project`,
                    },
                    { status: 400 },
                );
            }

            if (seenLanguages.has(language)) {
                return Response.json(
                    {
                        error: `More than one file was provided for "${language}"`,
                    },
                    { status: 400 },
                );
            }

            seenLanguages.add(language);

            let data: unknown;

            try {
                data = JSON.parse(await file.text());
            } catch {
                return Response.json(
                    { error: `File "${file.name}" contains invalid JSON` },
                    { status: 400 },
                );
            }

            importItems.push({ language, data });
        }

        importItems.sort(
            (a, b) =>
                Number(b.language === project.sourceLanguage) -
                Number(a.language === project.sourceLanguage),
        );

        const results = [];

        for (const item of importItems) {
            const result = await importTranslations(
                projectSlug,
                item.language,
                item.data,
            );

            results.push({
                language: item.language,
                ...result,
            });
        }

        return Response.json({ results });
    } catch (error) {
        console.error("Import error:", error);

        return Response.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Could not import translations",
            },
            { status: 400 },
        );
    }
}
