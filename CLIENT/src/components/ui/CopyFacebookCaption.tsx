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

#সংবাদ #বাংলাদেশ #${article.categoryBN}`;

    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-primary/90 hover:bg-primary/75 rounded px-4 py-2 text-white transition-colors"
    >
      {copied ? "কপি হয়েছে!" : "কপি করুন"}
    </button>
  );
}