"use client"

// Distributed via the shadcn registry from apps/web/registry/n-way-switch.tsx
// (standard "@/" aliases there instead of this monorepo's "@workspace/ui").
// Keep the two in sync.

import * as React from "react"

import { Toggle } from "@workspace/ui/components/toggle"
import { ToggleGroup } from "@workspace/ui/components/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

type NWaySwitchOption = {
  value: string
  label: string
  icon: React.ReactNode
  isOff?: boolean
}

type NWaySwitchCollapsible = "none" | "labels" | "full"

interface NWaySwitchProps {
  options: NWaySwitchOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  collapsible?: NWaySwitchCollapsible
  disabled?: boolean
  className?: string
  "aria-label"?: string
}

const itemBaseClassName =
  "focus-visible:ring-ring/50 relative z-10 flex h-auto min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border-none p-0 outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0"

function NWaySwitch({
  options,
  value,
  defaultValue,
  onValueChange,
  collapsible = "none",
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: NWaySwitchProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = React.useState(false)

  const resolvedValue = value ?? defaultValue ?? options[0]?.value
  const isFull = collapsible === "full"
  const showTooltips = collapsible === "labels" || collapsible === "full"
  const isOpen = !isFull || expanded

  React.useEffect(() => {
    if (!isFull || !expanded) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setExpanded(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [isFull, expanded])

  const openIfFull = () => isFull && setExpanded(true)
  const closeIfFull = () => isFull && setExpanded(false)

  const handleValueChange = (groupValue: string[]) => {
    const next = groupValue[0]
    if (next) onValueChange?.(next)
    if (isFull) setExpanded(false)
  }

  const renderItem = (option: NWaySwitchOption) => {
    const isSelected = option.value === resolvedValue
    const isVisible = isOpen || isSelected

    const colorClassName = isSelected
      ? option.isOff
        ? "bg-transparent text-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-transparent data-[state=on]:bg-transparent"
        : "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground aria-pressed:bg-primary data-[state=on]:bg-primary"
      : "bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-transparent data-[state=on]:bg-transparent"

    const toggle = (
      <Toggle
        data-slot="n-way-switch-item"
        value={option.value}
        aria-label={option.label}
        className={cn(
          itemBaseClassName,
          colorClassName,
          showTooltips ? "size-7" : "h-7 px-2.5 text-xs sm:text-sm font-medium whitespace-nowrap"
        )}
      >
        {option.icon}
        {!showTooltips && <span>{option.label}</span>}
      </Toggle>
    )

    const item = !showTooltips ? (
      toggle
    ) : (
      <Tooltip>
        <TooltipTrigger render={toggle} />
        <TooltipContent side="top" sideOffset={6}>
          {option.label}
        </TooltipContent>
      </Tooltip>
    )

    if (!isFull) return <React.Fragment key={option.value}>{item}</React.Fragment>

    return (
      <span
        key={option.value}
        className={cn(
          "grid transition-[grid-template-columns] duration-200 ease-out",
          isVisible ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
        )}
      >
        <span className="mx-px overflow-hidden">{item}</span>
      </span>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={openIfFull}
      onMouseLeave={closeIfFull}
      onFocus={openIfFull}
      onBlur={closeIfFull}
      className="inline-flex"
    >
      <TooltipProvider delay={200} closeDelay={0}>
        <ToggleGroup
          data-slot="n-way-switch"
          aria-label={ariaLabel}
          value={resolvedValue ? [resolvedValue] : []}
          onValueChange={handleValueChange}
          onClick={openIfFull}
          disabled={disabled}
          spacing={isFull ? 0 : 2}
          className={cn(
            "relative inline-flex w-fit items-center rounded-full border border-transparent p-1",
            isOpen ? "bg-muted" : "bg-transparent",
            className
          )}
        >
          {options.map(renderItem)}
        </ToggleGroup>
      </TooltipProvider>
    </div>
  )
}

export {
  NWaySwitch,
  type NWaySwitchOption,
  type NWaySwitchProps,
  type NWaySwitchCollapsible,
}
