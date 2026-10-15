import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CreateProjectForm from "./CreateProjectForm";

export default async function Create() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return <CreateProjectForm userId={session.user.id} />;
}
