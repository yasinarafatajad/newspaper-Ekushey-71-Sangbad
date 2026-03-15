import type { Request, Response } from "express";
import puppeteer from "puppeteer";
import { api } from "../lib/api.js";

export const newsPdf = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        // fetch article from your existing API or DB
        const response = await fetch(`${api}/news/${slug}`);
        const article = await response.json();

        if (!article) return res.status(404).send("Article not found");

        const browser = await puppeteer.launch({
    headless: true,
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process"
    ],
});
        const page = await browser.newPage();

        // HTML content for PDF
        const html = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1f2937; }
            h1 { font-size: 28px; margin-bottom: 0.2em; }
            p { margin: 0.5em 0; line-height: 1.5; }
            img { max-width: 100%; margin: 10px 0; }
            .author { font-size: 12px; color: #6b7280; }
            .logo { width: 150px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${article.bnTitle}</h1>
          <p class="author">${article.author?.name} | ${new Date(article.createdAt).toLocaleDateString()}</p>
          <div>${article.content.replace(/\n/g, "<br/>")}</div>
        </body>
      </html>
    `;

        await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${slug}.pdf`
        );
        res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to generate PDF");
    }
}