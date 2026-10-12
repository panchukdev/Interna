import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data",
    },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: "#EF6461",
                },
                secondary: {
                    main: "#E4B363",
                },
                background: {
                    default: "#E8E9EB",
                    paper: "#E0DFD5",
                },
                text: {
                    primary: "#313638",
                    secondary: "#3a4042",
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: "#EF6461",
                },
                secondary: {
                    main: "#E4B363",
                },
                background: {
                    default: "#121212",
                    paper: "#1E1E1E",
                },
                text: {
                    primary: "#F5F5F5",
                    secondary: "#B0B0B0",
                },
                AppBar: {
                    darkBg: "#EF6461",
                    darkColor: "#FFFFFF",
                },
            },
        },
    },
});

export default theme;
