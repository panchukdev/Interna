"use client";

import { Button } from "@mui/material";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
    children: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
};

export default function SubmitButton({
    children,
    endIcon,
    disabled,
    size,
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            variant="contained"
            loading={pending}
            loadingPosition="start"
            endIcon={endIcon}
            disabled={disabled}
            size={size}
        >
            {children}
        </Button>
    );
}
