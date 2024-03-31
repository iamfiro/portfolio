import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

export const metadata: Metadata = {
	title: "조성주 - FIRO 포트폴리오",
	description: "상상을 현실로 만드는 프론트엔드 개발자",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
