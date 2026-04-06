# Design Log #0005 - Multiple Choice Staff Training Quiz

## Background
The user wants to upgrade the text-based Training Quiz to a multiple-choice format (1 correct answer, 4 total options).

## Problem
The current quiz relies on manual text entry, which is prone to typos and lacks the engagement of a multiple-choice format. We need to dynamically generate 3 distractors from other records in the database to provide a total of 4 options.

## Questions and Answers
1. **Q: What if there are fewer than 4 records in the database?**
   - **A:** The system will attempt to show as many options as possible (up to 4). If there are fewer than 4, it will just show whatever is available.
2. **Q: How will the options be selected?**
   - **A:** We will fetch the correct question and then fetch a pool of other responses to pick 3 random distractors that are *not* the correct answer.

## Design

### Quiz Logic (QuizView.vue)
- **`options` State:** A `ref<string[]>` to store the 4 shuffled choices.
- **Selection Algorithm:**
  1. Fetch the target `issueCode` and its `response` (Correct Answer).
  2. Fetch the full list of responses.
  3. Filter out the correct answer from the pool.
  4. Shuffle the remaining pool and take the first 3 (Distractors).
  5. Merge Correct Answer + Distractors.
  6. Shuffle the final 4 options.

### UI Update
- Replace the `textarea` with a list of 4 radio buttons or distinct buttons.
- Ensure the layout remains responsive and clean.

## Implementation Plan

### Phase 1: Logic Update
1. Update `QuizView.vue` script to handle fetching distractors and shuffling options.
2. Implement a `selectedAnswer` ref to track the user's choice.

### Phase 2: Template Update
1. Replace the manual input with a `v-for` loop over the `options` array.
2. Use buttons or radio inputs for selection.

### Phase 3: Verification
1. Test the quiz with 1, 2, 3, and 4+ records in the DB to ensure it handles small datasets gracefully.
2. Confirm that the "Next Question" correctly resets the choices.

## Implementation Results
- [x] Phase 1: Logic Update (Dynamic distractor generation)
- [x] Phase 2: Template Update (Multiple choice UI)

## Summary of Deviations
1. **Deduplication:** Added a `Set` to the distractor pool to ensure that if multiple issues have the same response text, the quiz doesn't show duplicate options.
2. **Graceful Degradation:** If the database has fewer than 4 unique responses, the quiz will show as many as available (e.g., if there are only 2 records, it will show 2 options).
