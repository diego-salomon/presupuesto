# Design system — Presupuesto

The system that keeps the app consistent and white-label. It is small on purpose:
CSS-variable tokens, a handful of primitives, and a few composed patterns. This
document is derived from the shipped code (`src/index.css` and `src/shared/ui`).

## Principles

1. **Consistency over creativity.** The same token and component everywhere; a
   category card looks and behaves like every other category card.
2. **White-label by tokens.** The brand is one color set at runtime; nothing
   client-specific is hardcoded in a component.
3. **Operate-mode restraint.** This is a tool people use, not a page they admire.
   Precision and scanability outrank expression; one authored motion moment.
4. **Accessible by default.** WCAG 2.1 AA is the floor, in both light and dark.

## Tokens

All colors are HSL triplets consumed as `hsl(var(--token))`, defined in
`src/index.css` and mapped to Tailwind utilities via `@theme inline`. Token
coverage is complete: no component uses a hex value or a raw Tailwind palette
color. The one literal is `bg-black/50`, the modal scrim.

### Color — neutrals & brand

| Token | Role |
|---|---|
| `--background` / `--foreground` | page base |
| `--card` / `--card-foreground` | raised surfaces |
| `--muted` / `--muted-foreground` | secondary surfaces and text |
| `--border` / `--input` | hairlines and field borders |
| `--ring` | focus ring (= `--primary`) |
| `--primary` / `--primary-foreground` | brand color + text on it (set at runtime) |

### Color — status

Status comes in two forms because one color cannot serve both a solid fill (needs
white text → dark color) and colored text on a card (needs a light color in dark
mode). Keeping them apart is what holds AA in both themes.

| Token | Role | Contrast |
|---|---|---|
| `--ok` / `--warning` / `--exceeded` (+ `-foreground`) | **solid fills**: bars, badges, the exceeded alert | ≥ 4.5:1 with their foreground, constant across modes |
| `--ok-text` / `--exceeded-text` | **colored text** on cards (deltas, overruns, errors) | ≥ 4.5:1 on card background, mode-aware |
| `--track` | progress-bar track | — |

### Radius, type, motion

- `--radius: 0.75rem`, with `--radius-sm/md/lg/xl` derived from it.
- `--font-sans`: the platform system stack (system fonts ship optical sizing and
  legibility tuning; no web font to load). Headings use `tracking-tight`; body at
  default tracking. Numbers use `tabular-nums` so columns align.
- Motion: a single entrance (`pop-in` + `fade-in`, ~180ms, ease-out) for on-demand
  surfaces; progress bars animate their width (500ms). Everything is
  `transform`/`opacity` only. `prefers-reduced-motion` neutralizes all of it.

## Theming (white-label + dark)

- The brand color is pushed into `--primary` / `--primary-foreground` at boot by
  `applyBrandPalette` from `brand.config.ts`. It is one hue in both modes, so it is
  never re-themed per mode (and never overrides a dark-mode token).
- Light and dark are full token sets in `:root` and
  `@media (prefers-color-scheme: dark)`. Dark follows the OS; there is no toggle.
- Selection and caret are themed from `--primary`; the focus ring is `--primary`
  at 2px with a 2px offset.

## Components (`src/shared/ui`)

### Button
- **Variants:** `primary` (brand fill), `secondary` (bordered card), `ghost`
  (text), `danger` (exceeded fill).
- **States:** hover (opacity/surface), **active** (`scale-0.98`, feedback on press),
  disabled (50% opacity, non-interactive, no press scale).
- **A11y:** real `<button>`, `type="button"` by default, ≥ 44px tall (touch target).

### Card
- One elevation: `border` + `bg-card` + `shadow-sm` (offset + soft blur, not a halo).
  Never nested.

### Fields (`Input`, `Select`, `Textarea`, `Field`)
- `Field` wraps a control with a `<label>` (`htmlFor`), optional hint, and an
  error with `role="alert"`. Controls are ≥ 44px, show a focus ring, and set a red
  border on `aria-invalid`. Errors are wired via `aria-describedby`.

### ProgressBar
- `role="progressbar"` with `aria-valuenow/min/max` and a label. Fill color comes
  from the budget status (`ok`/`warning`/`exceeded`); width is capped at 100%.

### StatusBadge
- Solid pill, one per status: `ok` / `warning` / `exceeded`, each with its paired
  foreground. **Status is conveyed by text, never color alone** (WCAG 1.4.1).

### Dialog
- Centered modal: overlay scrim, `role="dialog"` + `aria-modal` + label, Escape to
  close, focus moved into the panel on open and restored to the trigger on close.
  Materializes with `pop-in`.

## Patterns

- **Dashboard** — a hero total (month spend vs. budget, with the overall bar and an
  alert when any category is over) above a responsive grid of category cards. An
  onboarding empty state replaces the grid when there is no data yet.
- **Form** — stacked `Field`s, required fields marked, submit disabled until the
  required ones are filled, errors inline (not on submit). The amount field shows
  the currency symbol so the unit is never ambiguous.
- **History** — combinable filters (search, category, date range) over a list of
  expense rows; count and total update live.
- **Destructive action** — always a `Dialog` confirm that names the consequence
  ("no se puede deshacer"), never a bare button.

## Accessibility baseline

- Contrast ≥ 4.5:1 for text in both themes (status colors split to guarantee it).
- One `<h1>` per page; sections use `<h2>`/`<h3>`. Landmarks: `<header>`, `<nav>`
  (labelled), `<main>`, `<footer>`.
- Keyboard: everything operable; visible focus ring; modal moves and restores focus.
- Touch targets ≥ 44px. Reduced-motion honored.

## Audit result

| Category | Defined | Hardcoded found |
|---|---|---|
| Colors | token set (neutrals, brand, status) | 0 hex/rgb, 0 raw palette classes (1 scrim `black/50`) |
| Radius | `--radius` scale | 0 arbitrary |
| Type | system stack + scale | 0 custom fonts |

Score: the system is small and fully tokenized; the main way to extend it is to add
a token or a primitive in `src/shared/ui`, not a one-off value in a component.
