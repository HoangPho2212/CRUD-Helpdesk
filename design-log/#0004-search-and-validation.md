# Design Log #0004 - Search/Filter & Data Validation

## Background
The Helpdesk system is operational with full CRUD, a training quiz, and navigation. To further improve the "Excellent" grade, we are adding client-side search/filtering for users to easily find specific responses and robust frontend validation for issue codes.

## Problem
1. **Search/Filter:** Users with many helpdesk responses cannot quickly find a specific `issueCode` or `category` without scrolling.
2. **Data Validation:** There is currently no check on the `issueCode` format (e.g., `ABC-123`) before data is sent to the database, which can lead to inconsistent data.

## Questions and Answers
1. **Q: Should the search be case-sensitive?**
   - **A:** No. Searching for "it" should match "IT" and "it".
2. **Q: What is the specific regex for the `issueCode`?**
   - **A:** We'll use `^[A-Z]{3}-\d{3}$`. This means exactly 3 uppercase letters, a hyphen, and exactly 3 digits.
3. **Q: Should the search filter the table live or on "Enter"?**
   - **A:** Live filtering (using a `computed` property in Vue) provides the best user experience.

## Design

### Search/Filter (ResponseList.vue)
- Add a text input bound to a `searchQuery` ref.
- Implement a `filteredResponses` computed property:
  ```typescript
  const filteredResponses = computed(() => {
    return responses.value.filter(r => 
      r.issueCode.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  ```

### Data Validation (Add/Edit Components)
- Use a `regex` pattern: `/^[A-Z]{3}-\d{3}$/`.
- Show a validation error message in the UI if the `issueCode` does not match the pattern.
- Disable the submit button if the input is invalid.

## Implementation Plan

### Phase 1: Search/Filter
1. Modify `client/src/components/ResponseList.vue` to include a search bar.
2. Update the template to loop over `filteredResponses` instead of `responses`.

### Phase 2: Regex Validation
1. Update `client/src/components/AddResponse.vue` with regex validation logic and an error message.
2. Update `client/src/components/EditResponse.vue` with the same validation logic.

### Phase 3: Verification
1. Manually test searching by code and category.
2. Manually test entering invalid `issueCode` formats (e.g., `abc-123`, `ABCD-123`, `ABC123`).

## Examples

### ✅ Good: Regex Validation (Vue)
```typescript
const isCodeValid = computed(() => /^[A-Z]{3}-\d{3}$/.test(formData.issueCode));
```

### ❌ Bad: No Validation
```typescript
const submitForm = async () => {
  await helpdeskApi.create(formData); // Sends whatever is in the input
};
```

## Implementation Results
- [x] Phase 1: Search/Filter (ResponseList.vue)
- [x] Phase 2: Regex Validation (Add/Edit components)

## Summary of Deviations
1. **Live Filtering:** Used a `computed` property for `filteredResponses` to ensure the table updates immediately as the user types, providing a modern "instant search" feel.
2. **Dynamic UI Validation:** Instead of just checking on submit, the UI now provides real-time feedback with error messages and disables the submit button until the `issueCode` format (`ABC-123`) is correct.
3. **Template Cleanup:** Added a "No responses match" message to the `ResponseList` template to improve UX when no records match the filter.
