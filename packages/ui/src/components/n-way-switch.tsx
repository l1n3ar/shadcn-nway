"use client"

import * as React from "react"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import { Tooltip } from "@base-ui/react/tooltip"

import { cn } from "@workspace/ui/lib/utils"

type NWaySwitchOption = {
  value: string
  label: string
  icon: React.ReactNode
  /** Marks this option as the "off" position: selecting it renders without the "on" fill. */
  isOff?: boolean
}

type NWaySwitchCollapsible = "none" | "labels" | "full"

interface NWaySwitchProps {
  options: NWaySwitchOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /**
   * - "none": icons and labels always visible side by side.
   * - "labels": icon-only segments; each segment's label shows in a tooltip on hover/focus.
   * - "full": collapsed to just the selected icon; hover (desktop), tap (mobile), or
   *   keyboard focus expands the track, at which point it behaves like "labels".
   */
  collapsible?: NWaySwitchCollapsible
  disabled?: boolean
  className?: string
  "aria-label"?: string
}

const itemBaseClassName =
  "focus-visible:ring-ring/50 relative z-10 flex items-center justify-center rounded-full border-none outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0"

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
        ? "bg-transparent text-foreground"
        : "bg-primary text-primary-foreground"
      : "bg-transparent text-muted-foreground hover:text-foreground"

    const toggle = (
      <Toggle
        data-slot="n-way-switch-item"
        value={option.value}
        aria-label={option.label}
        className={cn(
          itemBaseClassName,
          colorClassName,
          showTooltips ? "size-7" : "h-7 gap-1.5 px-2.5 text-sm font-medium whitespace-nowrap"
        )}
      >
        {option.icon}
        {!showTooltips && <span>{option.label}</span>}
      </Toggle>
    )

    const item = !showTooltips ? (
      toggle
    ) : (
      <Tooltip.Root>
        <Tooltip.Trigger render={toggle} />
        <Tooltip.Portal>
          <Tooltip.Positioner side="top" sideOffset={6}>
            <Tooltip.Popup className="bg-foreground text-background rounded-md px-2 py-1 text-xs font-medium shadow-md">
              {option.label}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
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
      <Tooltip.Provider delay={200} closeDelay={0}>
        <ToggleGroup
          data-slot="n-way-switch"
          aria-label={ariaLabel}
          value={resolvedValue ? [resolvedValue] : []}
          onValueChange={handleValueChange}
          onClick={openIfFull}
          disabled={disabled}
          className={cn(
            "relative inline-flex items-center rounded-full border border-transparent p-1",
            isOpen ? "bg-muted" : "bg-transparent",
            !isFull && "gap-0.5",
            className
          )}
        >
          {options.map(renderItem)}
        </ToggleGroup>
      </Tooltip.Provider>
    </div>
  )
}

export {
  NWaySwitch,
  type NWaySwitchOption,
  type NWaySwitchProps,
  type NWaySwitchCollapsible,
}
