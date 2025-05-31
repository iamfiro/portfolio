'use client';

import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { Divider, HStack, Typo } from "@/components/ui";
import { copyToClipboard } from "@/lib/clipboard";

import s from './parts.module.scss'

type Props = {
    email: string;
    githubId: string;
    instagramId: string;
}

export default function SidebarSocial({ email, githubId, instagramId }: Props) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyEmail = async () => {
        const success = await copyToClipboard(email);
        if (success) {
            setTimeout(() => setIsCopied(true), 2000);
        }
    };


    return (
        <HStack className={s.social}>
            <button className={s.email} onClick={handleCopyEmail}>
                {isCopied ? (
                    <>
                        <CopyCheck size={18} />
                        <Typo.Body>Copied!</Typo.Body>  
                    </>
                ) : (
                    <>
                        <Copy size={18} />
                        <Typo.Body>{email}</Typo.Body>
                    </>
                )}
            </button>
            <a href={`https://github.com/${githubId}`} target="_blank" className={s.socialButton}>
                <Image src={'/svg/github.svg'} alt="Github" width={16} height={16} />
                <Typo.Subtext>{githubId}</Typo.Subtext>
            </a>
            <Divider fullHeight />
            <a href={`https://instagram.com/${instagramId}`} target="_blank" className={s.socialButton}>
                <Image src={'/svg/instagram.svg'} alt="Instagram" width={16} height={16} />
                <Typo.Subtext>{instagramId}</Typo.Subtext>
            </a>

        </HStack>
    )
}