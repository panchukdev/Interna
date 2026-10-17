"use client";

import {
    Box,
    Container,
    Step,
    StepConnector,
    StepLabel,
    Stepper,
    styled,
    Typography,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import TranslateIcon from "@mui/icons-material/Translate";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { useTranslations } from "next-intl";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    position: "absolute",
    top: 20,
    left: "calc(-50% + 20px)",
    right: "calc(50% + 20px)",

    "& .MuiStepConnector-line": {
        borderColor: theme.palette.divider,
        borderTopWidth: 2,
        borderRadius: 1,
    },
}));

const VerticalConnector = styled(StepConnector)(({ theme }) => ({
    "& .MuiStepConnector-line": {
        borderColor: theme.palette.divider,
        borderLeftWidth: 2,
        minHeight: 32,
    },
}));

export default function HowItWorks() {
    const t = useTranslations("landing.howItWorks");

    const steps = [
        {
            title: t("steps.create.title"),
            description: t("steps.create.description"),
            icon: FolderOpenIcon,
        },
        {
            title: t("steps.manage.title"),
            description: t("steps.manage.description"),
            icon: TranslateIcon,
        },
        {
            title: t("steps.track.title"),
            description: t("steps.track.description"),
            icon: ChecklistIcon,
        },
    ];
    return (
        <section>
            <Container
                disableGutters
                sx={{
                    display: "flex",
                    width: "100%",
                    minHeight: {
                        xs: "calc(100dvh - 56px)",
                        sm: "calc(100dvh - 64px)",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: { xs: 4, md: 8 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "auto",
                        width: "100%",
                        justifyContent: "space-around",
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: "300", color: "text.secondary" }}
                        >
                            {t("eyebrow")}
                        </Typography>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontWeight: "600",
                                color: "primary.main",
                                fontSize: { xs: 36, md: 44 },
                            }}
                        >
                            {t("title")}
                        </Typography>
                    </Box>
                    <Typography
                        variant="body1"
                        component="p"
                        sx={{
                            fontWeight: "300",
                            color: "text.secondary",
                            fontSize: { xs: 20, md: 26 },
                        }}
                    >
                        {t("description")}
                    </Typography>
                </Box>
                <Stepper
                    alternativeLabel
                    orientation="horizontal"
                    connector={<ColorlibConnector />}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        width: "100%",
                        alignItems: "stretch",
                        "& .MuiStep-root": {
                            flex: 1,
                            px: 2,
                        },
                        "& .MuiStepLabel-root": {
                            flexDirection: "column",
                            alignItems: "flex-start",
                        },
                        "& .MuiStepLabel-iconContainer": {
                            pb: 2,
                            width: "100%",
                            justifyContent: "center",
                        },
                        "& .MuiStep-root:first-of-type .MuiStepLabel-iconContainer":
                            {
                                justifyContent: "flex-start",
                            },
                        "& .MuiStep-root:last-of-type .MuiStepLabel-iconContainer":
                            {
                                justifyContent: "flex-end",
                            },
                        "& .MuiStepLabel-labelContainer": {
                            width: "100%",
                            textAlign: "left",
                        },
                        "& .MuiStepConnector-root": {
                            top: 20,
                            left: "calc(-50% + 20px)",
                            right: "calc(50% + 20px)",
                        },
                        "& .MuiStep-root:nth-of-type(2) .MuiStepConnector-root":
                            {
                                left: "calc(-100% + 56px)",
                                right: "calc(50% + 20px)",
                            },
                        "& .MuiStep-root:nth-of-type(3) .MuiStepConnector-root":
                            {
                                left: "calc(-50% + 20px)",
                                right: 56,
                            },
                    }}
                >
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <Step key={step.title} completed={false}>
                                <StepLabel
                                    icon={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: 40,
                                                height: 40,
                                                borderRadius: 2,
                                                bgcolor: "action.hover",
                                                color: "primary.main",
                                            }}
                                        >
                                            <Icon />
                                        </Box>
                                    }
                                >
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{
                                            fontWeight: 600,
                                            color: "primary.main",
                                            mb: 1,
                                            textAlign: "left",
                                        }}
                                    >
                                        {`${index + 1} — ${step.title}`}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "text.secondary",
                                            lineHeight: 1.8,
                                            textAlign: "left",
                                        }}
                                    >
                                        {step.description}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <Stepper
                    orientation="vertical"
                    connector={<VerticalConnector />}
                    sx={{ display: { xs: "flex", md: "none" } }}
                >
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <Step key={step.title} completed={false}>
                                <StepLabel
                                    icon={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: 40,
                                                height: 40,
                                                borderRadius: 2,
                                                bgcolor: "action.hover",
                                                color: "primary.main",
                                            }}
                                        >
                                            <Icon />
                                        </Box>
                                    }
                                >
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{
                                            fontWeight: 600,
                                            color: "primary.main",
                                            mb: 1,
                                        }}
                                    >
                                        {`${index + 1} — ${step.title}`}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "text.secondary",
                                            lineHeight: 1.8,
                                        }}
                                    >
                                        {step.description}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Container>
        </section>
    );
}
