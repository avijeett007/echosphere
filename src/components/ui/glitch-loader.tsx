"use client"

import { cn } from "@/lib/utils"

export function GlitchLoader({ text, className }: { text: string, className?: string }) {
  return (
    <div className={cn("glitch", className)} data-text={text}>
      {text}
    </div>
  )
}
