import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Usage: cn("text-red-500", condition && "bg-blue-500")
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

