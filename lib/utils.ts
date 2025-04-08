import { twMerge } from "tailwind-merge";

type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean } | ClassValue[];

/**
 * Simple implementation of clsx functionality
 */
function clsx(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter(Boolean)
    .map((c) => {
      if (typeof c === 'object') {
        return Object.entries(c)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return String(c);
    })
    .join(' ');
}

/**
 * Combines multiple class names using clsx and ensures
 * Tailwind classes are properly merged with tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Formats a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Truncates a string to a specified length
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Safely accesses a deeply nested property without errors
 */
export function getNestedValue(obj: any, path: string, defaultValue: any = undefined) {
  const keys = path.split(".");
  return keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : defaultValue), obj);
} 