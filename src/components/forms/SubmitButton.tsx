"use client";

import { Button, type ButtonProps } from "@mui/material";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = Omit<ButtonProps, "type" | "variant"> & {
    children: React.ReactNode;
};

export default function SubmitButton({
    children,
    ...props
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button
            {...props}
            type="submit"
            variant="contained"
            loading={pending}
            loadingPosition="start"
        >
            {children}
        </Button>
    );
}
