'use client';

import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { Divider, HStack, Typo } from "@/components/ui";

import s from './parts.module.scss'

export default function SidebarSocial() {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('hello@devfiro.com');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <HStack className={s.social}>
            <button className={s.email} onClick={handleCopy}>
                {isCopied ? (
                    <>
                        <CopyCheck size={18} />
                        <Typo.Body>Copied!</Typo.Body>
                    </>
                ) : (
                    <>
                        <Copy size={18} />
                        <Typo.Body>hi@devfiro.com</Typo.Body>
                    </>
                )}
            </button>
            <a href="https://github.com/iamfiro" target="_blank" className={s.socialButton}>
                <Image src={'/svg/github.svg'} alt="Github" width={18} height={18} />
                <Typo.Body>iamfiro</Typo.Body>
            </a>
            <Divider fullHeight />
            <a href="https://instagram.com/chxs_u" target="_blank" className={s.socialButton}>
                <Image src={'/svg/instagram.svg'} alt="Instagram" width={18} height={18} />
                <Typo.Body>chxs_u</Typo.Body>
            </a>

        </HStack>
    )
}