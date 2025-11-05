import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 조건부로 결합하고 충돌을 해결
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

