"use client";

import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { usePhoneStore } from "@/store/PhoneStore";
import TextType from "../TextType";
import "./Thinking.css";

export default function AI_Input_Search() {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 52, maxHeight: 200 });
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState< string[]>([]);

    const [allPhones, setAllPhones] = useState< string[]>([]);

    const setPhone = usePhoneStore((s) => s.setPhone);
    const setVideo = usePhoneStore((s) => s.setVideo);

    // تحميل phones.json
    useEffect(() => {
        const loadPhones = async () => {
            try {
                const res = await fetch("/data/phones.json");
                const data = await res.json();
                setAllPhones(data);
            } catch (err) {
                console.error("Failed to load phones.json", err);
            }
        };
        loadPhones();
    }, []);

    // اقتراحات
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setValue(val);
        adjustHeight();

        if (val.length < 1) {
            setSuggestions([]);
            return;
        }

        const filtered = allPhones
            .filter((p) => p.toLowerCase().includes(val.toLowerCase()))
            .slice(0, 5);

        setSuggestions(filtered);
    };

    const handleSubmit = async () => {
        if (!value.trim()) return;

        setLoading(true);
        setError("");
        setSuggestions([]);

    
    

        try {
            // 1) AI info
            const res = await fetch("/api/phone-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: value.trim() }),
            });

            const data = await res.json();

            if (data.error) {
                setError(data.details?.[0]?.message || "Error");
                setPhone(null);
            } else {
                
                setPhone(data);
            }

            // 2) YouTube
            const resV = await fetch("/api/search-youtube", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: value.trim() }),
            });

            const videoData = await resV.json();
            if (videoData.youtubeReviewId) {
                setVideo(videoData.youtubeReviewId);
            }

        } catch (err) {
            setError("Request failed");
            setPhone(null);
        } finally {
            setLoading(false);
            setValue("");
            adjustHeight(true);
        }
    };

    return (
        <div className="md:w-full w-auto mx-5 mt-16">
            <div className="relative max-w-xl w-full mx-auto">

                {/* INPUT */}
                <div
                    role="textbox"
                    tabIndex={0}
                    className={cn(
                        "relative flex flex-col rounded-xl transition-all duration-200 w-full text-left cursor-text",
                        "ring-1 ring-black/10 dark:ring-white/10",
                        isFocused && "ring-black/20 dark:ring-white/20 outline-none"
                    )}
                    onClick={() => textareaRef.current?.focus()}
                >
                    <Textarea
                        value={value}
                        placeholder="Search any phone with AI..."
                        className="w-full rounded-xl rounded-b-none px-4 py-5 bg-black/6 dark:bg-white/6 border-0 dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0  "
                        ref={textareaRef}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />

                    {/* الاقتراحات — اسم فقط */}
                    {suggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-white dark:bg-black rounded-xl shadow-lg z-10 max-h-50 overflow-auto">
                            {suggestions.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                        setValue(item);
                                        setSuggestions([]);
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className=" bg-black/6 dark:bg-white/6 rounded-b-xl">
                        <div className="absolute right-3 bottom-4 ">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={cn(
                                    "rounded-lg p-2 transition-colors",
                                    value
                                        ? "bg-gray-300 dark:text-gray-700 cursor-pointer"
                                        : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40"
                                )}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="mt-3 text-center absolute left-1/2 -translate-x-1/2">
                    {loading && <div className="loader">Thinking...</div>}

                    {error && (
                        <TextType
                            text={[error]}
                            typingSpeed={50}
                            pauseDuration={8000}
                            showCursor={true}
                            cursorCharacter="_|"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
