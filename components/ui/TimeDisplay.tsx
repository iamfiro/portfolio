'use client'

import { useEffect, useState } from "react";

import { Typo } from "@/components/ui";

export default function TimeDisplay() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return <Typo.Subtext>{time.toLocaleTimeString()}</Typo.Subtext>;
}