# Design Log #0007 - External CSS Migration

## Background
The user wants to migrate all component-internal (scoped) CSS to an external, global stylesheet. This follows best practices for separating style from logic and structure, making the codebase more "professional".

## Problem
Currently, styles are embedded within `.vue` files using `<style scoped>` or `<style>`. We need to:
1. Extract all these styles.
2. Consolidate them into a single `client/src/assets/styles.css` file.
3. Remove the `<style>` blocks from `.vue` files.
4. Import the central stylesheet in `main.ts`.

## Questions and Answers
1. **Q: How to handle scoped styles in a global file?**
   - **A:** We will use class-based selectors. Since many components use common class names like `.error` or `.actions`, we will prefix them or use descendant selectors (e.g., `.quiz-view .error`) to maintain specific styling without scoped isolation.

## Design

### New File: `client/src/assets/styles.css`
This file will contain all the CSS extracted from the components, organized by component/view.

### Component Updates
Each `.vue` file will have its `<style>` block removed.

### Main Entry Update
`client/src/main.ts` will import the new CSS file.

## Implementation Plan

### Phase 1: CSS Extraction & Consolidation
1. Create `client/src/assets/styles.css`.
2. Copy all styles from `App.vue`, `Navbar.vue`, `HomeView.vue`, `ManagementView.vue`, `QuizView.vue`, `SystemInfoView.vue`, `ResponseList.vue`, `AddResponse.vue`, and `EditResponse.vue`.
3. Refine selectors to avoid global namespace pollution.

### Phase 2: Component Cleanup
1. Remove `<style>` and `<style scoped>` blocks from all `.vue` files.

### Phase 3: Integration
1. Update `client/src/main.ts` to import `./assets/styles.css`.

### Phase 4: Verification
1. Run the app and ensure the UI looks identical to the previous version.

## Implementation Results
- [x] Phase 1: CSS Extraction & Consolidation (client/src/assets/styles.css)
- [x] Phase 2: Component Cleanup (All .vue files)
- [x] Phase 3: Integration (main.ts)

## Summary of Deviations
None. All internal styles were successfully moved to an external stylesheet, and components were simplified by removing `<style>` blocks.
