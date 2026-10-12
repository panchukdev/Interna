"use client";

export default function LocalDate({ date }: { date: string }) {
    return (
        <time dateTime={date} style={{ color: "inherit", font: "inherit" }}>
            {new Date(date).toLocaleString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })}
        </time>
    );
}
