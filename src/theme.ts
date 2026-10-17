import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data",
    },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: "#286A48",
                    contrastText: "#FFFFFF",
                },
                secondary: {
                    main: "#4E6355",
                    contrastText: "#FFFFFF",
                },
                error: {
                    main: "#BA1A1A",
                },
                background: {
                    default: "#F6FBF4",
                    paper: "#FFFFFF",
                },
                text: {
                    primary: "#171D19",
                    secondary: "#404942",
                },
                divider: "#C0C9C0",
                success: {
                    main: "#286A48",
                    contrastText: "#FFFFFF",
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: "#286A48",
                    contrastText: "#FFFFFF",
                },
                secondary: {
                    main: "#B5CCBB",
                    contrastText: "#213528",
                },
                error: {
                    main: "#BA1A1A",
                },
                background: {
                    default: "#0F1511",
                    paper: "#171D19",
                },
                text: {
                    primary: "#DFE4DD",
                    secondary: "#C0C9C0",
                },
                divider: "#404942",
                AppBar: {
                    darkBg: "#22452e",
                    darkColor: "#DFE4DD",
                },
                success: {
                    main: "#92D5AC",
                    contrastText: "#003921",
                },
            },
        },
    },
});

export default theme;
