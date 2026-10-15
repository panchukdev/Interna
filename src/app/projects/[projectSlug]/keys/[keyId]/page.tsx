import { notFound, redirect } from "next/navigation";
import { getProject } from "@/src/lib/projects";
import EditKeyForm from "./EditKeyForm";
import { getKey } from "@/src/lib/keys";
import { getTranslations } from "@/src/lib/translations";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export default async function AddKey({
    params,
}: {
    params: Promise<{ projectSlug: string; keyId: string }>;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }
    const { projectSlug, keyId } = await params;
    const project = await getProject(projectSlug, session.user.id);

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
