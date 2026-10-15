import { auth } from "@/src/lib/auth";
import { getProjects } from "@/src/lib/projects";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Projects() {
    const t = await getTranslations("projects");

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
                {t("title")}
            </Typography>

            {!projects || projects.length === 0 ? (
                <Typography variant="body1" sx={{ fontWeight: 300 }}>
                    {t("empty")}
                </Typography>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))",
                            lg: "repeat(3, minmax(0, 1fr))",
                        },
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
                                minWidth: 0,
                            }}
                        >
                            <Card
                                sx={{
                                    transition: "0.2s",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    height: "100%",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image="/images/template.svg"
                                    alt={`${project.title} preview`}
                                    sx={{
                                        width: "100%",
                                        aspectRatio: "16 / 9",
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
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </Box>
            )}
        </Box>
    );
}
