"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";

export function ImageUpload({ initialImage, inputName }: { initialImage?: string; inputName?: string }) {
    const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);
    const [imageUrl, setImageUrl] = useState(initialImage || "");

    const handleImageUrlChange = (url: string) => {
        setImageUrl(url);
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">Image URL</label>
            <div className="flex gap-3">
                <input
                    name={inputName || "imageUrl"}
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300"
                />
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-600">
                    <ImagePlus className="w-6 h-6" />
                </div>
            </div>
            {imagePreview && (
                <div className="relative mt-3 inline-block rounded-2xl overflow-hidden border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover" />
                    <button
                        type="button"
                        onClick={() => { setImagePreview(null); setImageUrl(""); }}
                        className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-black/80 transition-colors"
                        aria-label="Remove image"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider px-1">
                Paste a URL to your image (hosted externally)
            </p>
        </div>
    );
}
