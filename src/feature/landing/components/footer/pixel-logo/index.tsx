import { usePixelLogo } from "@/feature/landing/hooks/use-pixel-logo";
import { Image } from "@/shared/components/ui";

import { PIXEL_LOGO_COLUMNS } from "./pixel-logo.util";

import s from "./style.module.scss";

interface Props {
  src: string;
  /** 로고 가로를 쪼갤 칸 수. 클수록 픽셀이 잘아진다 */
  columns?: number;
  className?: string;
}

/**
 * 로고를 WebGL 픽셀 격자로 다시 그린다.
 * 흩어진 픽셀이 모여들며 등장하고, 포인터가 지나가면 밀려나며 물든다.
 */
export default function PixelLogo({
  src,
  columns = PIXEL_LOGO_COLUMNS,
  className,
}: Props) {
  const { canvasRef, supported, aspectRatio } = usePixelLogo({ src, columns });

  if (!supported) {
    return <Image src={src} alt="" objectFit="contain" className={className} />;
  }

  const canvasClassName = [s.canvas, className].filter(Boolean).join(" ");

  // 디자인 시스템에 캔버스 추상화가 없어 WebGL 표면은 canvas를 직접 쓴다
  return (
    <canvas
      ref={canvasRef}
      className={canvasClassName}
      width={0}
      height={0}
      style={{ aspectRatio }}
      aria-hidden
    />
  );
}
