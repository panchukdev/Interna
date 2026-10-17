import { Container } from "@mui/material";
import Hero from "@/src/components/landing/Hero";
import Features from "@/src/components/landing/Features";
import HowItWorks from "@/src/components/landing/HowItWorks";
import FinalCTA from "@/src/components/landing/FinalCTA";

export default function Home() {
    return (
        <Container
            disableGutters
            sx={{ display: "flex", flexDirection: "column", gap: { xs: 10 } }}
        >
            <Hero />
            <Features />
            <HowItWorks />
            <FinalCTA />
        </Container>
    );
}
