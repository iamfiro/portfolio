'use client'

import { useEffect, useRef } from 'react';
import style from './style.module.scss';

const Cursor = () => {
    const circleElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mouse = { x: 0, y: 0 };
        const previousMouse = { x: 0, y: 0 }
        const circle = { x: 0, y: 0 };

        let currentScale = 0;
        let currentAngle = 0;

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        const speed = 0.05;

        const tick = () => {
            circle.x += (mouse.x - circle.x) * speed;
            circle.y += (mouse.y - circle.y) * speed;

            const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

            const deltaMouseX = mouse.x - previousMouse.x;
            const deltaMouseY = mouse.y - previousMouse.y;

            previousMouse.x = mouse.x;
            previousMouse.y = mouse.y;

            const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150); 

            const scaleValue = (mouseVelocity / 150) * 0.5;

            currentScale += (scaleValue - currentScale) * speed;

            const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

            const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;

            if (mouseVelocity > 20) {
                currentAngle = angle;
            }

            const rotateTransform = `rotate(${currentAngle}deg)`;

            if(circleElement.current) circleElement.current.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;

            window.requestAnimationFrame(tick);
        }
        
        setInterval(() => {
            tick();
        }, 1000);
    }, []);

    return (
        <div className={'cursor'} ref={circleElement}></div>
    )
};

export default Cursor;