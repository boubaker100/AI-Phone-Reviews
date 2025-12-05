"use client";

import { useTheme } from "next-themes";
import Particles from "@/components/Hero/Particles";

export default function ParticlesHero() {
    const { theme } = useTheme();

    return (

        <>
            {theme === "dark" && (
                <div className="absolute inset-0 -z-10">
                    <Particles
                    />
                </div>
            )}

        </>
    )
}
