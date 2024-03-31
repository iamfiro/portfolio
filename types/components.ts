import React from "react";

export interface TitleProps {
    readonly size: number;
    readonly children: React.ReactNode;
    readonly color: string;
    readonly weight?: number;
    readonly style?: React.CSSProperties;
    readonly bold?: boolean;
}