'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import s from './style.module.scss';

interface StackIconProps {
    iconUrl: string;
    size?: number;
    showTooltip?: boolean;
    tooltipName?: string;
}

const StackIcon = ({
    iconUrl,
    size = 24,
    showTooltip = false,
    tooltipName,
}: StackIconProps) => {
    const iconRef = useRef<HTMLDivElement>(null);
    const [tooltipStyle, setTooltipStyle] = useState({});

    const updateTooltipPosition = () => {
        if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            setTooltipStyle({
                left: `${rect.left + rect.width / 2}px`,
                top: `${rect.bottom}px`,
            });
        }
    };

    useEffect(() => {
        if (showTooltip) {
            updateTooltipPosition();
            window.addEventListener('scroll', updateTooltipPosition);
            window.addEventListener('resize', updateTooltipPosition);

            return () => {
                window.removeEventListener('scroll', updateTooltipPosition);
                window.removeEventListener('resize', updateTooltipPosition);
            };
        }
    }, [showTooltip]);

    return (
        <div 
            ref={iconRef} 
            className={s.iconWrapper} 
            style={{ width: size, height: size }}
        >
            <Image
                src={iconUrl}
                alt={tooltipName || iconUrl}
                width={size}
                height={size}
            />
            {showTooltip && (
                <span className={s.tooltip} style={tooltipStyle}>
                    {tooltipName || iconUrl}
                </span>
            )}
        </div>
    );
};

export default StackIcon;