import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import Link from "next/link";

export default function Projects() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                p: 3,
            }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Projects List
            </Typography>

            <Box component="div" sx={{ width: "100%", maxWidth: 500 }}>
                <Link
                    href="/projects/1"
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
                            alt="Project preview"
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
                                Project 1
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Manage project languages and translations.
                            </Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Box>
        </Box>
    );
}
