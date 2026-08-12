"use client"

import * as React from "react"
import {
  AppWindow,
  Check,
  Code2,
  Copy,
  FolderSearch,
  Globe,
  Moon,
  PowerOff,
  Sun,
  ToggleLeft,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@workspace/ui/components/button"
import {
  NWaySwitch,
  type NWaySwitchCollapsible,
  type NWaySwitchOption,
} from "@workspace/ui/components/n-way-switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

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

function snippetFor(collapsible: NWaySwitchCollapsible) {
  return `import { AppWindow, Globe, PowerOff } from "lucide-react"
import { NWaySwitch } from "@/components/ui/n-way-switch"

const options = [
  { value: "off", label: "Off", icon: <PowerOff />, isOff: true },
  { value: "provider", label: "Provider Search", icon: <Globe /> },
  { value: "app", label: "App Search", icon: <AppWindow /> },
]

export function SearchModeSwitch() {
  const [value, setValue] = useState("provider")

  return (
    <NWaySwitch
      aria-label="Search mode"
      collapsible="${collapsible}"
      options={options}
      value={value}
      onValueChange={setValue}
    />
  )
}
`
}

const USAGE_SNIPPETS: Record<NWaySwitchCollapsible, string> = {
  none: snippetFor("none"),
  labels: snippetFor("labels"),
  full: snippetFor("full"),
}

const FOUR_WAY_SNIPPET = `import { AppWindow, FolderSearch, Globe, PowerOff } from "lucide-react"
import { NWaySwitch } from "@/components/ui/n-way-switch"

const options = [
  { value: "off", label: "Off", icon: <PowerOff />, isOff: true },
  { value: "provider", label: "Provider Search", icon: <Globe /> },
  { value: "app", label: "App Search", icon: <AppWindow /> },
  { value: "local", label: "Local Search", icon: <FolderSearch /> },
]

export function SearchModeSwitch() {
  const [value, setValue] = useState("provider")

  return (
    <NWaySwitch
      aria-label="Search mode"
      collapsible="labels"
      options={options}
      value={value}
      onValueChange={setValue}
    />
  )
}
`

const PROPS: { name: string; type: string; default: string; description: string }[] = [
  {
    name: "options",
    type: "NWaySwitchOption[]",
    default: "required",
    description: "The segments to render. Each needs a value, a label, and an icon.",
  },
  {
    name: "value",
    type: "string",
    default: "-",
    description: "Selected value, for controlled use.",
  },
  {
    name: "defaultValue",
    type: "string",
    default: "first option",
    description: "Selected value, for uncontrolled use.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    default: "-",
    description: "Called when the selection changes.",
  },
  {
    name: "collapsible",
    type: '"none" | "labels" | "full"',
    default: '"none"',
    description: "Controls whether labels show inline, in a tooltip, or the switch collapses to one icon.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the whole switch.",
  },
  {
    name: "aria-label",
    type: "string",
    default: "-",
    description: "Accessible name for the switch group.",
  },
  {
    name: "options[].isOff",
    type: "boolean",
    default: "false",
    description: "Marks this option as the off position. Selecting it renders without the on fill.",
  },
]

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      onClick={handleCopy}
      aria-label={label}
      className="hover:cursor-pointer"
    >
      {copied ? <Check className="text-primary size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <pre className="bg-muted overflow-x-auto rounded-lg p-3 pr-10 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      <div className="absolute top-1 right-1">
        <CopyButton text={code} label="Copy code" />
      </div>
    </div>
  )
}

function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-sm font-semibold">{title}</h2>
      {description ? (
        <p className="text-muted-foreground text-xs">{description}</p>
      ) : null}
    </div>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="hover:cursor-pointer"
    >
      {mounted && resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}

function SiteHeader() {
  return (
    <div className="flex flex-col gap-1">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ToggleLeft className="text-primary size-5" />
          <span className="text-lg font-medium">N-Way Switch</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            render={
              <a
                href="https://github.com/l1n3ar/shadcn-3way-switch"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <Code2 />
            Repository
          </Button>
          <ThemeToggle />


        </div>
      </header>
      <p className="text-muted-foreground text-xs">
        An exclusive-select toggle switch for any number of options, with icons, labels,
        and a dedicated off state.
      </p>
    </div>

  )
}

function SiteFooter() {
  return (
    <footer className="text-muted-foreground flex items-center justify-between border-t pt-4 text-xs">
      <span>
        Built by{" "}
        <a
          href="https://github.com/l1n3ar"
          target="_blank"
          rel="noreferrer"
          className="text-foreground hover:underline"
        >
          l1n3ar
        </a>
      </span>
      <a
        href="https://github.com/l1n3ar/shadcn-3way-switch"
        target="_blank"
        rel="noreferrer"
        className="text-foreground hover:underline"
      >
        Source on GitHub
      </a>
    </footer>
  )
}

function InstallCommand() {
  const [origin, setOrigin] = React.useState("")

  React.useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const command = `npx shadcn@latest add ${origin || "https://your-domain.com"}/r/n-way-switch.json`

  return (
    <div className="bg-muted/50 flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
      <code className="overflow-x-auto font-mono text-xs whitespace-nowrap">{command}</code>
      <CopyButton text={command} label="Copy install command" />
    </div>
  )
}

export default function Page() {
  const [mode, setMode] = React.useState<NWaySwitchCollapsible>("labels")
  const [value, setValue] = React.useState("provider")
  const [value4, setValue4] = React.useState("provider")

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-6 pt-8">
      <SiteHeader />


      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <SectionHeading
            title="Playground"
            description="Try each display mode. Hover a segment in Labels, or hover and tap in Full."
          />

          <Tabs
            value={mode}
            onValueChange={(next) => setMode(next as NWaySwitchCollapsible)}
            className="rounded-xl border p-4"
          >
            <TabsList className="self-start">
              {MODES.map((m) => (
                <TabsTrigger key={m.value} value={m.value} className="text-xs">
                  {m.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {MODES.map((m) => (
              <TabsContent key={m.value} value={m.value} className="flex flex-col gap-3">
                <div className="flex min-h-16 items-center justify-center rounded-lg border border-dashed p-6">
                  <NWaySwitch
                    aria-label="Search mode"
                    options={SEARCH_OPTIONS}
                    collapsible={m.value}
                    value={value}
                    onValueChange={setValue}
                  />
                </div>

                <CodeBlock code={USAGE_SNIPPETS[m.value]} />
              </TabsContent>
            ))}
          </Tabs>
        </div>


      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl border p-4">
          <SectionHeading
            title="Installation"
            description="Add the component straight into your own project with the shadcn CLI."
          />
          <InstallCommand />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl border p-4">
          <SectionHeading
            title="Usage"
            description="Import the component and pass it an options array. Selection is exclusive."
          />
          <CodeBlock code={USAGE_SNIPPETS.none} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading title="Props" />
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Prop</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Default</th>
                <th className="px-3 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {PROPS.map((prop) => (
                <tr key={prop.name}>
                  <td className="px-3 py-2 font-mono whitespace-nowrap">{prop.name}</td>
                  <td className="text-muted-foreground px-3 py-2 font-mono whitespace-nowrap">
                    {prop.type}
                  </td>
                  <td className="text-muted-foreground px-3 py-2 font-mono whitespace-nowrap">
                    {prop.default}
                  </td>
                  <td className="text-muted-foreground px-3 py-2">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
