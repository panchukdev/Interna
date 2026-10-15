import { auth } from "@/src/lib/auth";
import { getProjects } from "@/src/lib/projects";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Projects() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const projects = await getProjects(session.user.id);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
                p: 3,
            }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Projects List
            </Typography>

            {!projects || projects.length === 0 ? (
                <Typography variant="body1" sx={{ fontWeight: 300 }}>
                    You have no projects
                </Typography>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "xl",
                        display: "flex",
                        gap: 2,
                    }}
                >
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.slug}`}
                            style={{
                                display: "block",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <Card
                                sx={{
                                    transition: "0.2s",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height={200}
                                    image="/images/template.svg"
                                    alt={`${project.title} preview`}
                                    sx={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                    }}
                                />

                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        gutterBottom
                                    >
                                        {project.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Manage project languages and
                                        translations.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </Box>
            )}
        </Box>
    );
}
