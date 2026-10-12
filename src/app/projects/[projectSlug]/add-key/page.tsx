import { notFound } from "next/navigation";
import { getProject } from "../../../../lib/projects";
import AddKeyForm from "./AddKeyForm";

export default async function AddKey({
    params,
}: {
    params: Promise<{ projectSlug: string }>;
}) {
    const { projectSlug } = await params;
    const project = await getProject(projectSlug);

    if (!project) {
        notFound();
    }

    return <AddKeyForm project={project} />;
}
