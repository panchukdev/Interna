"use client";

import Link from "next/link";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TranslateIcon from "@mui/icons-material/Translate";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import LinkButton from "../LinkButton";
import { useTranslations } from "next-intl";

export default function Navbar({ session }) {
    const t = useTranslations("navigation");

    const pages = [
        { name: t("myProjects"), href: "/projects" },
        { name: t("newProject"), href: "/create" },
    ];
    const avatarMenu = [
        { page: t("profile"), href: "/profile" },
        { page: t("settings"), href: "/settings" },
        { page: t("signOut"), action: "signOut" },
    ];

    const router = useRouter();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null,
    );
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null,
    );

    const initials = session
        ? session.user.name
              .split(" ")
              .map((part) => part[0])
              .join("")
        : "U";

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    handleCloseUserMenu();
                    router.push("/sign-in");
                    router.refresh();
                },
            },
        });
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="fixed">
            <Container maxWidth={false}>
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: { xs: "56px", sm: "64px" },
                    }}
                >
                    <TranslateIcon
                        sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        INTERNA
                    </Typography>
                    {session && (
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: "block", md: "none" } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem
                                        href={page.href}
                                        key={page.name}
                                        onClick={handleCloseNavMenu}
                                        component={Link}
                                    >
                                        <Typography
                                            sx={{ textAlign: "center" }}
                                        >
                                            {page.name}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )}
                    <TranslateIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        INTERNA
                    </Typography>
                    {session && (
                        <>
                            <Box
                                sx={{
                                    ml: "auto",
                                    display: { xs: "none", md: "flex" },
                                    mr: 2,
                                }}
                            >
                                {pages.map((page) => (
                                    <Button
                                        component={Link}
                                        href={page.href}
                                        key={page.name}
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            my: 2,
                                            color: "white",
                                            display: "block",
                                        }}
                                    >
                                        {page.name}
                                    </Button>
                                ))}
                            </Box>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title={t("openMenu")}>
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar
                                            alt="User"
                                            sx={{
                                                backgroundColor: "primary.main",
                                                color: "primary.contrastText",
                                                border: 1,
                                                borderColor: "divider",
                                            }}
                                        >
                                            {initials}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {avatarMenu.map((menu) => (
                                        <MenuItem
                                            key={menu.page}
                                            onClick={() => {
                                                handleCloseUserMenu();

                                                if (
                                                    "action" in menu &&
                                                    menu.action === "signOut"
                                                ) {
                                                    void handleSignOut();
                                                } else if ("href" in menu) {
                                                    router.push(menu.href);
                                                }
                                            }}
                                        >
                                            <Typography
                                                sx={{ textAlign: "center" }}
                                            >
                                                {menu.page}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </>
                    )}
                    {!session && (
                        <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
                            <LinkButton href="/sign-in">
                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        color: "white",
                                        fontSize: { xs: 14, md: "1rem" },
                                    }}
                                >
                                    {t("signIn")}
                                </Typography>
                            </LinkButton>
                            <LinkButton href="/sign-up">
                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        color: "white",
                                        fontSize: { xs: 14, md: "1rem" },
                                    }}
                                >
                                    {t("signUp")}
                                </Typography>
                            </LinkButton>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
