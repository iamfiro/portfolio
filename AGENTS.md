<critical_rules>
REMINDER:
1. Use `component/ui` abstractions before writing UI. If a required abstraction does not exist, stop and propose it.
2. Read `variables.scss` directly before writing SCSS, then use only defined design tokens.
3. Follow the project naming, structure, and component patterns exactly.
</critical_rules>

<context>
This project is a personal portfolio service built with React.js, Vite, TypeScript, SCSS Modules, React Router v7, and Lucide React.

The codebase prioritizes consistent UI, design-system usage, and feature-based organization.
</context>

<file_structure>
Follow this file naming convention:

| Type | Pattern | Example |
|---|---|---|
| Component | `kebab-case/index.tsx` | `most-famous-product/index.tsx` |
| Type | `{name}.type.ts` | `party-card.type.ts` |
| Utility | `{name}.util.ts` | `party-card.util.ts` |
| Style | `style.module.scss` | `style.module.scss` |
| Barrel | `index.ts` | `index.ts` |

Group files by feature and colocate related files in the same directory.
</file_structure>

<ui_rules>
Use existing components from `component/ui` instead of raw HTML tags in feature code.

Examples:
- Text → `Typo`
- Button → `Button`
- Layout → `Column` or `Row`
- Icons → `lucide-react`

This rule exists because raw HTML bypasses the design system and creates inconsistent UI.
</ui_rules>

<component_rules>
Use functional React components only.

Use this component pattern:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

import s from "./style.module.scss";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "large" | "medium";
}

export default function ComponentName({
  children,
  variant = "primary",
  size = "medium",
  className,
  ...props
}: Props) {
  const componentClassName = [
    s.component,
    s[size],
    s[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button className={componentClassName} {...props}>
      {children}
    </Button>
  );
}
```

Rules:
- Import styles as `s`.
- Keep the style import last.
- Use `default export` for components.
- Define props with an `interface` when extending HTML attributes.
- Compose `className` with array + `.filter(Boolean).join(" ")`.
</component_rules>

<typescript_rules>
Use explicit TypeScript types.

Prefer interfaces for props, discriminated unions for context-based components, utility types like `Pick` when they improve clarity, and enums for stable domain values.
</typescript_rules>

<scss_rules>
Use SCSS Modules.

Before writing or modifying any SCSS, always read `variables.scss` directly and use only the tokens defined there.

Do not manually import `variables.scss`; the SCSS configuration already provides variables globally.

Use tokens for color, spacing, radius, border, surface, and shadow. Hardcoded visual values are invalid because they break consistency and theme control.

Group related SCSS properties with blank lines in this order:
1. Layout and positioning
2. Flex/grid alignment
3. Spacing
4. Color and background
5. Border and radius
6. Typography
7. Shadow, transition, and animation
</scss_rules>

<react_rules>
Separate reusable logic into custom hooks.

Use `React.memo` only for expensive rendering.

Use compound components only when a component has clear semantic sub-parts.

Extract mapped item rendering into a separate component when the JSX becomes complex or reused.

Avoid imperative ref patterns unless there is a clear UI integration reason.
</react_rules>

<quality_rules>
Run lint fixes with:

```bash
npx eslint --fix
```

Use Korean comments when helpful.

Use JSDoc only for public APIs.

Omit comments when the code is already self-explanatory.
</quality_rules>

<done_definition>
A component task is complete when:
1. Folder and file names follow the project convention.
2. Props are typed clearly.
3. UI is built with `component/ui` abstractions.
4. SCSS Modules use only tokens from `variables.scss`.
5. Raw HTML is avoided when a UI abstraction exists.
6. Class names follow the project composition pattern.
7. Avoidable lint issues are fixed with `npx eslint --fix`.
</done_definition>