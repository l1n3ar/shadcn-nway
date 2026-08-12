# N-Way Switch

An exclusive-select toggle switch for any number of options, built for shadcn's
`base-nova` style on top of Base UI's `Toggle Group`. Not just three-way: pass
any number of options and it works the same way. One option can be marked as
the "off" position, and the rest render as "on".

Try it live and grab the install command from the demo page (`apps/web`), or
copy the component straight from `packages/ui/src/components/n-way-switch.tsx`.

## Features

- Exclusive single selection across any number of options (3 is just typical).
- A dedicated "off" option (`isOff`) that renders without the "on" fill.
- Three display modes via the `collapsible` prop:
  - `"none"`: icon and label always shown side by side.
  - `"labels"`: icon only, with the label shown in a tooltip on hover or focus.
  - `"full"`: collapsed to just the selected icon. Hover on desktop, tap on
    mobile, or keyboard focus expands the full track.
- Built on shadcn's own `Toggle`, `Toggle Group`, and `Tooltip` components, so
  it matches the rest of a base-nova style project and keeps accessibility
  (keyboard navigation, focus management, ARIA roles) handled by Base UI.

## Installation

Install directly into your own project with the shadcn CLI, pointing at this
project's registry endpoint:

```bash
npx shadcn@latest add https://shadcn-nway-switch.vercel.app/r/n-way-switch.json
```


## Usage

```tsx
import { AppWindow, Globe, PowerOff } from "lucide-react"
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
      collapsible="labels"
      options={options}
      value={value}
      onValueChange={setValue}
    />
  )
}
```

## Props

| Prop                | Type                            | Default       | Description                                                                            |
| ------------------- | -------------------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `options`           | `NWaySwitchOption[]`             | required      | The segments to render. Each needs a `value`, a `label`, and an `icon`.                 |
| `value`             | `string`                         | -             | Selected value, for controlled use.                                                     |
| `defaultValue`      | `string`                         | first option  | Selected value, for uncontrolled use.                                                    |
| `onValueChange`     | `(value: string) => void`        | -             | Called when the selection changes.                                                       |
| `collapsible`       | `"none" \| "labels" \| "full"`   | `"none"`      | Controls whether labels show inline, in a tooltip, or the switch collapses to one icon.  |
| `disabled`          | `boolean`                        | `false`       | Disables the whole switch.                                                                |
| `aria-label`        | `string`                         | -             | Accessible name for the switch group.                                                    |
| `options[].isOff`   | `boolean`                        | `false`       | Marks this option as the off position. Selecting it renders without the on fill.        |

## Project structure

This is a Turborepo monorepo:

- `apps/web`: Next.js app hosting the demo page and the shadcn registry
  endpoint (`public/r/n-way-switch.json`, built from `apps/web/registry.json`).
- `packages/ui`: the shared shadcn component package. `n-way-switch.tsx` lives
  here alongside the generated `toggle`, `toggle-group`, and `tooltip`
  components it composes.

## Development

```bash
npm install
npm run dev      # start the demo app
npm run build    # build all workspaces
npm run typecheck
npm run lint
```

To rebuild the registry JSON after changing the component:

```bash
cd apps/web
npx shadcn build
```

## Adding more shadcn components

To add another shadcn component to the `ui` package, run from `packages/ui`:

```bash
npx shadcn add <component>
```

This places the component in `packages/ui/src/components`, ready to import
from `@workspace/ui/components/<component>`.

## Credits

Built by [l1n3ar](https://github.com/l1n3ar). Source available on
[GitHub](https://github.com/l1n3ar/shadcn-nway).
