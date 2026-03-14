"use client";
export default function ShareFacebook() {
    // share news in facebook

    const handleShareFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
    };

    return (
        <button
            onClick={handleShareFacebook}
            className="bg-primary/90 hover:bg-primary/75 rounded px-4 py-2 text-neutral-subtle text-nowrap transition-colors"
        >
            ফেসবুক
        </button>
    );
}