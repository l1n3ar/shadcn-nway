"use client"

import * as React from "react"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import { Tooltip } from "@base-ui/react/tooltip"

import { cn } from "@workspace/ui/lib/utils"

type ThreeWaySwitchOption = {
  value: string
  label: string
  icon: React.ReactNode
  /** Marks this option as the "off" position: selecting it hides the sliding indicator. */
  isOff?: boolean
}

type ThreeWaySwitchCollapsible = "none" | "labels" | "full"

interface ThreeWaySwitchProps {
  options: ThreeWaySwitchOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /**
   * - "none": icons and labels always visible side by side.
   * - "labels": icon-only segments; each segment's label shows in a tooltip on hover/focus.
   * - "full": collapsed to just the selected icon; hover (desktop) or tap (mobile)
   *   expands the track, at which point it behaves like "labels".
   */
  collapsible?: ThreeWaySwitchCollapsible
  disabled?: boolean
  className?: string
  "aria-label"?: string
}

const itemBaseClassName =
  "focus-visible:ring-ring/50 relative z-10 flex items-center justify-center rounded-full border-none bg-transparent outline-none transition-colors focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0"

function ThreeWaySwitch({
  options,
  value,
  defaultValue,
  onValueChange,
  collapsible = "none",
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: ThreeWaySwitchProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({ opacity: 0 })
  const [expanded, setExpanded] = React.useState(false)

  const resolvedValue = value ?? defaultValue ?? options[0]?.value
  const selectedOption = options.find((option) => option.value === resolvedValue)
  const isFull = collapsible === "full"
  const showTooltips = collapsible === "labels" || collapsible === "full"
  const isCollapsedCompact = isFull && !expanded

  const updateIndicator = React.useCallback(() => {
    const item = resolvedValue ? itemRefs.current.get(resolvedValue) : undefined
    if (!item || selectedOption?.isOff) {
      setIndicatorStyle({ opacity: 0 })
      return
    }
    setIndicatorStyle({
      opacity: 1,
      width: item.offsetWidth,
      transform: `translateX(${item.offsetLeft}px)`,
    })
  }, [resolvedValue, selectedOption])

  React.useLayoutEffect(() => {
    if (!isCollapsedCompact) updateIndicator()
  }, [updateIndicator, options.length, isCollapsedCompact])

  React.useEffect(() => {
    if (!isFull || !expanded) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setExpanded(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [isFull, expanded])

  const handleValueChange = (groupValue: string[]) => {
    const next = groupValue[0]
    if (next) onValueChange?.(next)
    if (isFull) setExpanded(false)
  }

  const renderItem = (option: ThreeWaySwitchOption) => {
    const isSelected = option.value === resolvedValue
    const textColorClassName = isSelected
      ? option.isOff
        ? "text-foreground"
        : "text-primary-foreground"
      : "text-muted-foreground hover:text-foreground"

    const toggle = (
      <Toggle
        data-slot="three-way-switch-item"
        value={option.value}
        aria-label={option.label}
        ref={(node: HTMLButtonElement | null) => {
          if (node) itemRefs.current.set(option.value, node)
          else itemRefs.current.delete(option.value)
        }}
        className={cn(
          itemBaseClassName,
          textColorClassName,
          showTooltips
            ? "size-7"
            : "h-7 gap-1.5 px-2.5 text-sm font-medium whitespace-nowrap"
        )}
      >
        {option.icon}
        {!showTooltips && <span>{option.label}</span>}
      </Toggle>
    )

    if (!showTooltips) return <React.Fragment key={option.value}>{toggle}</React.Fragment>

    return (
      <Tooltip.Root key={option.value}>
        <Tooltip.Trigger render={toggle} />
        <Tooltip.Portal>
          <Tooltip.Positioner side="top" sideOffset={6}>
            <Tooltip.Popup className="bg-foreground text-background origin-[var(--transform-origin)] rounded-md px-2 py-1 text-xs font-medium shadow-md transition-[transform,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
              {option.label}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    )
  }

  if (isCollapsedCompact) {
    return (
      <button
        type="button"
        data-slot="three-way-switch"
        aria-label={ariaLabel ? `Expand ${ariaLabel}` : "Expand switch"}
        aria-expanded={false}
        disabled={disabled}
        onMouseEnter={() => setExpanded(true)}
        onClick={() => setExpanded(true)}
        className={cn(
          "focus-visible:ring-ring/50 inline-flex size-9 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
          selectedOption?.isOff
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground",
          className
        )}
      >
        {selectedOption?.icon}
      </button>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => isFull && setExpanded(true)}
      onMouseLeave={() => isFull && setExpanded(false)}
      className="inline-flex"
    >
      <Tooltip.Provider delay={200} closeDelay={0}>
        <ToggleGroup
          data-slot="three-way-switch"
          aria-label={ariaLabel}
          value={resolvedValue ? [resolvedValue] : []}
          onValueChange={handleValueChange}
          disabled={disabled}
          className={cn(
            "bg-muted relative inline-flex items-center gap-0.5 rounded-full border border-transparent p-1",
            className
          )}
        >
          <div
            aria-hidden
            className="bg-primary absolute top-1 bottom-1 left-0 rounded-full shadow-sm transition-[transform,width,opacity] duration-200 ease-out"
            style={indicatorStyle}
          />
          {options.map(renderItem)}
        </ToggleGroup>
      </Tooltip.Provider>
    </div>
  )
}

export {
  ThreeWaySwitch,
  type ThreeWaySwitchOption,
  type ThreeWaySwitchProps,
  type ThreeWaySwitchCollapsible,
}
