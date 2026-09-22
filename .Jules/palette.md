## 2025-05-18 - Icon-only Buttons & Keyboard Navigation in Interactive Trees
**Learning:** Icon-only action buttons (e.g. in tree items, toast dismiss, candidate copy, scene/beat actions) and custom `role="button"` elements in tree views require both explicit `aria-label` matching `title` and keyboard event handlers that respond to `Space` (' ') in addition to `Enter` with `e.preventDefault()`.
**Action:** When building custom icon action rows or tree item nodes in Grimoire, ensure `aria-label` is populated on every icon button and keyboard listeners handle both `Enter` and `Space`.

## 2025-05-18 - Context-Aware ARIA Labels & Native Tooltips in List Rows
**Learning:** Generic action labels (e.g. 'Edit scene' or 'Move beat up') in repeating list rows prevent screen readers from identifying which item an action applies to. Pairing context-specific `aria-label`s with matching `title` attributes and `aria-hidden="true"` on inner icons provides clear screen reader context and native browser tooltips without custom CSS/JS tooltips.
**Action:** When adding icon-only action rows for list items (scenes, beats, candidates, wards), include the item title or index in `aria-label` and `title`.
