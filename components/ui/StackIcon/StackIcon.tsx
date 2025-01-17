'use client';

import Image from 'next/image';
import { AvailableTechStack } from '@/constants/Project';
import s from './style.module.scss';
import { useEffect, useRef, useState } from 'react';

interface StackIconProps {
    iconName: AvailableTechStack;
    size?: number;
    showTooltip?: boolean;
    tooltipName?: string;
}

const StackIcon = ({
    iconName,
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
                src={`/svg/stack/${iconName}.svg`}
                alt={tooltipName || iconName}
                width={size}
                height={size}
            />
            {showTooltip && (
                <span className={s.tooltip} style={tooltipStyle}>
                    {tooltipName || iconName}
                </span>
            )}
        </div>
    );
};

export default StackIcon;