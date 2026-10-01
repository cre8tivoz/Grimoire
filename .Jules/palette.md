## 2025-05-18 - Icon-only Buttons & Keyboard Navigation in Interactive Trees
**Learning:** Icon-only action buttons (e.g. in tree items, toast dismiss, candidate copy, scene/beat actions) and custom `role="button"` elements in tree views require both explicit `aria-label` matching `title` and keyboard event handlers that respond to `Space` (' ') in addition to `Enter` with `e.preventDefault()`.
**Action:** When building custom icon action rows or tree item nodes in Grimoire, ensure `aria-label` is populated on every icon button and keyboard listeners handle both `Enter` and `Space`.

## 2025-05-18 - Context-Aware ARIA Labels & Native Tooltips in List Rows
**Learning:** Generic action labels (e.g. 'Edit scene' or 'Move beat up') in repeating list rows prevent screen readers from identifying which item an action applies to. Pairing context-specific `aria-label`s with matching `title` attributes and `aria-hidden="true"` on inner icons provides clear screen reader context and native browser tooltips without custom CSS/JS tooltips.
**Action:** When adding icon-only action rows for list items (scenes, beats, candidates, wards), include the item title or index in `aria-label` and `title`.

## 2025-05-18 - Async Action Buttons & Animated Spinner States
**Learning:** Async trigger buttons (e.g. in panel headers or tool drawers) require `disabled={state === "working"}` and `aria-busy={state === "working"}` to prevent duplicate invocations and signal pending status to screen readers, while loading icons must feature `className="animate-spin"` and `aria-hidden="true"`.
**Action:** Ensure all async panel submit and refresh buttons disable themselves during execution and pair `aria-busy` with animated `Loader2` spinners.

## 2025-05-18 - Dynamic Tooltips for Disabled Export Actions
**Learning:** Text buttons with disabled states (such as canvas export buttons) must convey their requirement dynamically through `title` tooltips and descriptive `aria-label` attributes (e.g. "Open a project with an active item to export") so keyboard and screen reader users understand why an action is disabled.
**Action:** When disabling action buttons in workspace toolbars, add explanatory `title` tooltips conditioned on the missing prerequisite.
