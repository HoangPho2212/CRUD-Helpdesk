# Design Log #0006 - Refine Actions Column visibility

## Background
The user wants to separate the "view-only" dashboard from the "management" interface. Currently, the `ResponseList` component always shows Edit/Delete buttons.

## Problem
The "Actions" column (Edit/Delete) is visible on the Dashboard (HomeView), where it is not intended to be used. It should only be visible on the Management page.

## Questions and Answers
1. **Q: How should we control the visibility?**
   - **A:** We'll add a `showActions` prop to the `ResponseList` component, defaulting to `false`.
2. **Q: Should we hide the entire column or just the buttons?**
   - **A:** The entire `<th>` and `<td>` for the Actions column should be conditionally rendered to keep the table clean.

## Design

### ResponseList Component
- Add a `props` definition:
  ```typescript
  const props = defineProps({
    showActions: { type: Boolean, default: false }
  });
  ```
- Use `v-if="showActions"` on the `<th>` and the `<td>` containing the buttons.

### View Updates
- **HomeView.vue:** No changes needed if we set the default to `false`, but for clarity, we can pass `:showActions="false"`.
- **ManagementView.vue:** Pass `:showActions="true"` to enable management capabilities.

## Implementation Plan

### Phase 1: Component Update
1. Modify `client/src/components/ResponseList.vue` to include the `showActions` prop and update the template.

### Phase 2: View Updates
1. Update `client/src/views/ManagementView.vue` to pass the `showActions` prop.
2. (Optional) Update `client/src/views/HomeView.vue` for consistency.

### Phase 3: Verification
1. Check the Dashboard to ensure the Actions column is gone.
2. Check the Management page to ensure Edit/Delete buttons still work correctly.

## Implementation Results
- [x] Phase 1: Component Update (ResponseList.vue)
- [x] Phase 2: View Updates (ManagementView.vue & HomeView.vue)

## Summary of Deviations
None. The implementation strictly followed the plan by using a `showActions` prop to toggle visibility between the Dashboard and Management pages.
