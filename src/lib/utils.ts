import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** 1 → "01" */
export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** Replace {name} placeholders in a content sentence. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? `{${k}}`))
}
