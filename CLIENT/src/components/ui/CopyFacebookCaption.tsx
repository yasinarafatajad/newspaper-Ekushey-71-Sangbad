"use client";

import { useState } from "react";
import { Article } from "@/lib/type";

interface Props {
  article: Article;
}

export default function CopyFacebookCaption({ article }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const articleUrl = window.location.href;

    const caption = `🔥 গুরুত্বপূর্ণ খবর!
📢 ${article.bnTitle}
এই বিষয়টি নিয়ে এখন আলোচনা চলছে সর্বত্র। বিস্তারিত জানতে পুরো খবরটি পড়ুন।

👉 সম্পূর্ণ সংবাদ পড়ুন:
${articleUrl}

💬 আপনার মতামত কী? কমেন্টে জানান এবং বন্ধুদের সঙ্গে শেয়ার করুন।

#সংবাদ #বাংলাদেশ #Ekushey71Sangbad #${article.categoryBN}`;

    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <>
      {!copied ? (
        <button
          onClick={handleCopy}
          className="bg-neutral-muted rounded-full p-2.5 text-black hover:text-primary text-nowrap transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={handleCopy}
          className="bg-neutral-muted rounded-full p-2.5 text-black hover:text-primary text-nowrap transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
            <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
          </svg>
        </button>
      )}
    </>
  );
}