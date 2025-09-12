import { ChevronsUpDown, LucideIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import Typo from "../typo";

import s from "./style.module.scss";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: LucideIcon;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Select({
  options,
  value,
  placeholder = "선택하세요",
  disabled = false,
  fullWidth = false,
  icon: Icon,
  onChange,
  className,
  style,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    setSelectedValue(option.value);
    setIsOpen(false);
    onChange?.(option.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex(
            (option) => option.value === selectedValue,
          );
          const nextIndex = Math.min(currentIndex + 1, options.length - 1);
          const nextOption = options[nextIndex];
          if (!nextOption.disabled) {
            setSelectedValue(nextOption.value);
            onChange?.(nextOption.value);
          }
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex(
            (option) => option.value === selectedValue,
          );
          const prevIndex = Math.max(currentIndex - 1, 0);
          const prevOption = options[prevIndex];
          if (!prevOption.disabled) {
            setSelectedValue(prevOption.value);
            onChange?.(prevOption.value);
          }
        }
        break;
    }
  };

  const selectClassName = [
    s.select,
    fullWidth ? s.fullWidth : "",
    disabled ? s.disabled : "",
    isOpen ? s.open : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={selectRef}
      className={selectClassName}
      style={style}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={s.trigger}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {Icon && <Icon className={s.icon} size={16} />}
        <div className={s.text}>
          <Typo.Subtext className={s.label}>
            {selectedOption ? selectedOption.label : placeholder}
          </Typo.Subtext>
          {selectedOption?.description && (
            <Typo.Caption className={s.description}>
              {selectedOption.description}
            </Typo.Caption>
          )}
        </div>
        <ChevronsUpDown className={s.arrow} size={16} />
      </div>

      {isOpen && (
        <div className={s.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={[
                s.option,
                option.value === selectedValue ? s.selected : "",
                option.disabled ? s.disabled : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleSelect(option)}
            >
              {Icon && <Icon className={s.icon} size={16} />}
              <div className={s.text}>
                <Typo.Subtext className={s.label}>{option.label}</Typo.Subtext>
                {option.description && (
                  <Typo.Caption className={s.description}>
                    {option.description}
                  </Typo.Caption>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
