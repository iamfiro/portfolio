import { Volume2, VolumeX } from "lucide-react";

import { IconButton } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  /** 배경 음악이 지금 들리는지 */
  on: boolean;
  onToggle: () => void;
  className?: string;
}

/** 배경 음악을 켜고 끄는 버튼. 어떤 배경 위에서도 보이도록 difference로 섞인다 */
export default function SoundToggle({ on, onToggle, className }: Props) {
  const Icon = on ? Volume2 : VolumeX;
  const toggleClassName = [s.toggle, className].filter(Boolean).join(" ");

  return (
    <IconButton
      // 전역 첫 입력으로 소리를 켜는 처리에서 이 버튼은 빠지고, 스스로 켜고 끈다
      data-sound-toggle
      aria-label={on ? "배경 음악 끄기" : "배경 음악 켜기"}
      aria-pressed={on}
      className={toggleClassName}
      onClick={onToggle}
    >
      <Icon aria-hidden size={20} />
    </IconButton>
  );
}
