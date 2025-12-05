"use client";

import { usePhoneStore } from "@/store/PhoneStore";
import { useState } from "react";

export default function VideoReview() {
    const video = usePhoneStore((s) => s.video);
    // تحقق من شكل البيانات: إذا video هو string مباشرة أو object
    const id = video; 

    if (!id) return null;

    

    const embed = `https://www.youtube-nocookie.com/embed/${id}?&rel=0&modestbranding=1`;

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">🎬 Top YouTube Review</h2>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
              
                <iframe
                    className="absolute inset-0 w-full h-full"
                    src={embed}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}
