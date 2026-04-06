<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const question = ref<HelpdeskContract | null>(null);
const userAnswer = ref('');
const feedback = ref<{ text: string; isCorrect: boolean } | null>(null);
const isLoading = ref(false);

const loadNextQuestion = async () => {
  isLoading.value = true;
  feedback.value = null;
  userAnswer.value = '';
  try {
    const res = await helpdeskApi.getRandom();
    question.value = res.data;
  } catch (err) {
    console.error('Failed to load quiz question', err);
  } finally {
    isLoading.value = false;
  }
};

const checkAnswer = () => {
  if (!question.value) return;
  
  const correct = question.value.response.trim().toLowerCase();
  const user = userAnswer.value.trim().toLowerCase();
  
  if (user === correct) {
    feedback.value = { text: '✅ Correct! Excellent work.', isCorrect: true };
  } else {
    feedback.value = { text: `❌ Not quite. The correct response was: "${question.value.response}"`, isCorrect: false };
  }
};

onMounted(loadNextQuestion);
</script>

<template>
  <div class="quiz-view">
    <h2>Staff Training Quiz</h2>
    <p>Predict the correct response for the following issue code:</p>
    
    <div v-if="isLoading">Loading question...</div>
    <div v-else-if="question" class="quiz-card">
      <div class="issue-box">
        <strong>Issue Code:</strong> <span>{{ question.issueCode }}</span>
      </div>
      
      <div class="answer-section">
        <label>Your Predicted Response:</label>
        <textarea v-model="userAnswer" rows="3" placeholder="Type your response here..."></textarea>
        <button @click="checkAnswer" :disabled="!userAnswer">Submit Answer</button>
      </div>
      
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

<style scoped>
.quiz-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.issue-box { font-size: 1.2rem; margin-bottom: 20px; padding: 10px; background: #eef; border-radius: 4px; }
.answer-section { margin-bottom: 20px; }
textarea { width: 100%; margin: 10px 0; padding: 10px; box-sizing: border-box; }
.feedback { padding: 15px; border-radius: 4px; margin-top: 15px; }
.feedback.correct { background: #e6ffed; border: 1px solid #b7eb8f; color: #1e4620; }
.feedback.incorrect { background: #fff1f0; border: 1px solid #ffa39e; color: #5c0011; }
.actions { margin-top: 15px; }
</style>
