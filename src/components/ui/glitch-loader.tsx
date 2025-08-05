"use client"

import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"

export function GlitchLoader({ text, className }: { text: string, className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Loader className="mr-2 h-4 w-4 animate-spin" />
      <span>{text}</span>
    </div>
  )
}
