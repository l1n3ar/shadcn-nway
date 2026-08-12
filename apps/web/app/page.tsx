"use client"

import * as React from "react"
import { Power, PowerOff, Sparkles } from "lucide-react"

import { ThreeWaySwitch } from "@workspace/ui/components/three-way-switch"

const POWER_OPTIONS = [
  { value: "off", label: "Off", icon: <PowerOff />, isOff: true },
  { value: "auto", label: "Auto", icon: <Sparkles /> },
  { value: "on", label: "On", icon: <Power /> },
]

export default function Page() {
  const [mode, setMode] = React.useState("auto")

  return (
    <div className="flex min-h-svh flex-col items-start gap-8 p-6">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">collapsible=&quot;none&quot; (always visible)</p>
        <ThreeWaySwitch
          aria-label="Power mode"
          options={POWER_OPTIONS}
          value={mode}
          onValueChange={setMode}
          collapsible="none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          collapsible=&quot;labels&quot; (hover a segment)
        </p>
        <ThreeWaySwitch
          aria-label="Power mode"
          options={POWER_OPTIONS}
          value={mode}
          onValueChange={setMode}
          collapsible="labels"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          collapsible=&quot;full&quot; (hover or tap to expand)
        </p>
        <ThreeWaySwitch
          aria-label="Power mode"
          options={POWER_OPTIONS}
          value={mode}
          onValueChange={setMode}
          collapsible="full"
        />
      </div>
    </div>
  )
}
