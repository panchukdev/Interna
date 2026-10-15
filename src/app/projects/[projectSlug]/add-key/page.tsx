import { notFound, redirect } from "next/navigation";
import { getProject } from "../../../../lib/projects";
import AddKeyForm from "./AddKeyForm";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export default async function AddKey({
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

    return <AddKeyForm project={project} />;
}
