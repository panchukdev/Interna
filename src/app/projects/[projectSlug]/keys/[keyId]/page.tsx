import { notFound } from "next/navigation";
import { getProject } from "@/src/lib/projects";
import EditKeyForm from "./EditKeyForm";
import { getKey } from "@/src/lib/keys";
import { getTranslations } from "@/src/lib/translations";

export default async function AddKey({
    params,
}: {
    params: Promise<{ projectSlug: string; keyId: string }>;
}) {
    const { projectSlug, keyId } = await params;
    const project = await getProject(projectSlug);

    if (!project) {
        notFound();
    }

    const id = Number(keyId);

    if (!Number.isInteger(id) || id <= 0) {
        notFound();
    }

    const key = await getKey(id, project.id);

    if (!key) {
        notFound();
    }

    const translations = await getTranslations(id);

    return (
        <EditKeyForm
            project={project}
            keyData={key}
            translations={translations}
        />
    );
}
