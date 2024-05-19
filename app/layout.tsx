import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.scss";

const NotoSansKR = Noto_Sans_KR({ weight: ['100', '200', '300', '400', '500', '600', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
    title: "조성주 — 꾸준히 성장하는 학생 개발자",
    description: "선린인고를 재학중인 프론트엔드 개발자입니다",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={NotoSansKR.className}>{children}</body>
        </html>
    );
}
