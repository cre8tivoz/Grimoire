# Palette's Journal - UX & Accessibility Learnings

## 2025-05-18 - Icon-only buttons in dense tree/card views need explicit ARIA labels
**Learning:** Dense tree and card components (like StoryPlanPanel) often rely on icon-only action buttons (`title` attribute only) which may not be voiced consistently or clearly by screen readers.
**Action:** Always provide explicit `aria-label` attributes on icon-only buttons alongside or in place of `title` attributes.
