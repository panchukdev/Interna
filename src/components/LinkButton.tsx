"use client";

import Button from "@mui/material/Button";
import Link from "next/link";
import type { ComponentProps } from "react";

type LinkButtonProps = Omit<
    ComponentProps<typeof Button>,
    "component" | "href"
> & {
    href: string;
};

export default function LinkButton({ href, ...props }: LinkButtonProps) {
    return <Button {...(props as object)} component={Link} href={href} />;
}
