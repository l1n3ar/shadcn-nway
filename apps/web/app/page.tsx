"use client"

import * as React from "react"
import { AppWindow, Check, Copy, FolderSearch, Globe, PowerOff } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  NWaySwitch,
  type NWaySwitchCollapsible,
  type NWaySwitchOption,
} from "@workspace/ui/components/n-way-switch"
import { cn } from "@workspace/ui/lib/utils"

const SEARCH_OPTIONS: NWaySwitchOption[] = [
  { value: "off", label: "Off", icon: <PowerOff />, isOff: true },
  { value: "provider", label: "Provider Search", icon: <Globe /> },
  { value: "app", label: "App Search", icon: <AppWindow /> },
]

const SEARCH_OPTIONS_4: NWaySwitchOption[] = [
  ...SEARCH_OPTIONS,
  { value: "local", label: "Local Search", icon: <FolderSearch /> },
]

const MODES: { value: NWaySwitchCollapsible; label: string }[] = [
  { value: "none", label: "None" },
  { value: "labels", label: "Labels" },
  { value: "full", label: "Full" },
]

const USAGE_SNIPPETS: Record<NWaySwitchCollapsible, string> = {
  none: `<NWaySwitch
  aria-label="Search mode"
  collapsible="none"
  options={[
    { value: "off", label: "Off", icon: <PowerOff />, isOff: true },
    { value: "provider", label: "Provider Search", icon: <Globe /> },
    { value: "app", label: "App Search", icon: <AppWindow /> },
  ]}
  value={value}
  onValueChange={setValue}
/>`,
  labels: `<NWaySwitch
  aria-label="Search mode"
  collapsible="labels"
  options={options}
  value={value}
  onValueChange={setValue}
/>`,
  full: `<NWaySwitch
  aria-label="Search mode"
  collapsible="full"
  options={options}
  value={value}
  onValueChange={setValue}
/>`,
}

function InstallCommand() {
  const [origin, setOrigin] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const command = `npx shadcn@latest add ${origin || "https://your-domain.com"}/r/n-way-switch.json`

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-muted/50 flex items-center justify-between gap-3 rounded-lg border px-4 py-3">
      <code className="overflow-x-auto font-mono text-sm whitespace-nowrap">{command}</code>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={handleCopy}
        aria-label="Copy install command"
      >
        {copied ? <Check className="text-primary" /> : <Copy />}
      </Button>
    </div>
  )
}

export default function Page() {
  const [mode, setMode] = React.useState<NWaySwitchCollapsible>("labels")
  const [value, setValue] = React.useState("provider")
  const [value4, setValue4] = React.useState("provider")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-10 p-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">N-Way Switch</h1>
        <p className="text-muted-foreground text-sm">
          An exclusive-select toggle switch for any number of options, with icons, labels,
          and a dedicated off state.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border p-6">
        <div className="bg-muted flex items-center gap-1 self-start rounded-lg p-1">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                mode === m.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex min-h-16 items-center justify-center rounded-lg border border-dashed p-8">
          <NWaySwitch
            aria-label="Search mode"
            options={SEARCH_OPTIONS}
            collapsible={mode}
            value={value}
            onValueChange={setValue}
          />
        </div>

        <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
          <code>{USAGE_SNIPPETS[mode]}</code>
        </pre>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border p-6">
        <div>
          <h2 className="font-medium">4-way example</h2>
          <p className="text-muted-foreground text-sm">
            <code className="text-foreground">options</code> accepts any number of entries —
            3 is just the typical case.
          </p>
        </div>
        <div className="flex min-h-16 items-center justify-center rounded-lg border border-dashed p-8">
          <NWaySwitch
            aria-label="Search mode"
            options={SEARCH_OPTIONS_4}
            collapsible="labels"
            value={value4}
            onValueChange={setValue4}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-medium">Installation</h2>
        <InstallCommand />
      </div>
    </div>
  )
}
