## 2025-05-18 - Icon-only Buttons & Keyboard Navigation in Interactive Trees
**Learning:** Icon-only action buttons (e.g. in tree items, toast dismiss, candidate copy, scene/beat actions) and custom `role="button"` elements in tree views require both explicit `aria-label` matching `title` and keyboard event handlers that respond to `Space` (' ') in addition to `Enter` with `e.preventDefault()`.
**Action:** When building custom icon action rows or tree item nodes in Grimoire, ensure `aria-label` is populated on every icon button and keyboard listeners handle both `Enter` and `Space`.
