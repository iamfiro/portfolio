import React from "react";

export interface BaseLayoutProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface LayoutSizeProps {
    fullWidth: boolean;
    fullHeight: boolean;
    fitContent: boolean;
}