import React from "react";

export interface TitleProps {
    size: number;
    children: React.ReactNode;
    color: string;
    weight?: number;
    style?: React.CSSProperties;
    bold?: boolean;
}