"use client";

import { Button } from "@mui/material";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
    children: React.ReactNode;
    endIcon: React.ReactNode;
    disabled?: boolean;
};

export default function SubmitButton({
    children,
    endIcon,
    disabled,
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
        >
            {children}
        </Button>
    );
}
