"use client";
import { api } from "@/lib/useApi/api";

interface Props {
    slug: string;
    className?: string;
}

export const DownloadPdfButton = ({ slug, className = '' }: Props) => {
    const downloadPdf = () => {
        const url = `${api}/news/pdf/${slug}`;
        window.open(url, "_blank");
    };

    return (
        <button onClick={downloadPdf} className={`bg-green-600 text-white px-4 py-2 rounded ${className}`}>
            Download PDF
        </button>
    );
};