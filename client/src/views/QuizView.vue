<script setup lang="ts">
/**
 * QuizView.vue - Staff Training Logic
 * This is the most complex part of the frontend. It fetches a random 
 * question and dynamically generates 3 unique distractors (wrong answers).
 */
import { ref, onMounted } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const question = ref<HelpdeskContract | null>(null);
const options = ref<string[]>([]); // Stores the 4 shuffled multiple-choice options
const selectedAnswer = ref('');
const feedback = ref<{ text: string; isCorrect: boolean } | null>(null);
const isLoading = ref(false);

/**
 * MULTIPLE CHOICE LOGIC
 * To create a fair quiz, we fetch the "correct" answer and "all" answers.
 * We then pick 3 random unique responses from the "all" list to act as distractors.
 */
const loadNextQuestion = async () => {
  isLoading.value = true;
  feedback.value = null;
  selectedAnswer.value = '';
  options.value = [];
  try {
    // We run both requests in parallel for speed
    const [qRes, allRes] = await Promise.all([
      helpdeskApi.getRandom(),
      helpdeskApi.getAll()
    ]);
    
    question.value = qRes.data;
    
    if (question.value) {
      // 1. Create a pool of "wrong" answers (exclude the correct one)
      const distractorPool = allRes.data
        .map(r => r.response)
        .filter(r => r !== question.value?.response);
      
      // 2. Remove duplicates from the pool using a Set
      const uniquePool = [...new Set(distractorPool)];
      
      // 3. Pick 3 random distractors from the unique pool
      const distractors = uniquePool
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
        
      // 4. Combine the Correct Answer with the 3 Distractors
      // 5. Shuffle the final array so the correct answer isn't always first
      options.value = [question.value.response, ...distractors]
        .sort(() => Math.random() - 0.5);
    }
  } catch (err) {
    console.error('Failed to load quiz question', err);
  } finally {
    isLoading.value = false;
  }
};

// Validates if the user's choice matches the database response
const checkAnswer = () => {
  if (!question.value || !selectedAnswer.value) return;
  
  const isCorrect = selectedAnswer.value === question.value.response;
  
  if (isCorrect) {
    feedback.value = { text: '✅ Correct! Excellent work.', isCorrect: true };
  } else {
    feedback.value = { text: `❌ Incorrect. The correct response was: "${question.value.response}"`, isCorrect: false };
  }
};

onMounted(loadNextQuestion);
</script>

<template>
  <div class="quiz-view">
    <h2>Staff Training Quiz</h2>
    <p>Select the correct response for the following issue code:</p>
    
    <div v-if="isLoading">Loading question...</div>
    <div v-else-if="question" class="quiz-card">
      <div class="issue-box">
        <strong>Issue Code:</strong> <span>{{ question.issueCode }}</span>
      </div>
      
      <div class="answer-section">
        <label>Select the correct response:</label>
        <div class="options-list">
          <div v-for="(option, index) in options" :key="index" 
            class="option-item"
            :class="{ 'correct-highlight': feedback && !feedback.isCorrect && option === question?.response }"
          >
            <input 
              type="radio" 
              :id="'opt-' + index" 
              :value="option" 
              v-model="selectedAnswer"
              :disabled="!!feedback"
            />
            <label :for="'opt-' + index">{{ option }}</label>
          </div>
        </div>
        <button @click="checkAnswer" :disabled="!selectedAnswer || !!feedback">Submit Answer</button>
      </div>
      
      <!-- Feedback Message -->
      <div v-if="feedback" :class="['feedback', feedback.isCorrect ? 'correct' : 'incorrect']">
        {{ feedback.text }}
        <div class="actions">
          <button @click="loadNextQuestion">Next Question</button>
        </div>
      </div>
    </div>
    <div v-else>
      No questions available. Please add some helpdesk responses first.
    </div>
  </div>
</template>
