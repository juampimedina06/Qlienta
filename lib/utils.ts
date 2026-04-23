import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImagenUrl = (url : string) => {
  if(!url) return ""
  //agregar timestamp para evitar cache
  return `${url}?t=${new Date().getTime()}`
}