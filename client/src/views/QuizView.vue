<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const question = ref<HelpdeskContract | null>(null);
const options = ref<string[]>([]);
const selectedAnswer = ref('');
const feedback = ref<{ text: string; isCorrect: boolean } | null>(null);
const isLoading = ref(false);

const loadNextQuestion = async () => {
  isLoading.value = true;
  feedback.value = null;
  selectedAnswer.value = '';
  options.value = [];
  try {
    const [qRes, allRes] = await Promise.all([
      helpdeskApi.getRandom(),
      helpdeskApi.getAll()
    ]);
    
    question.value = qRes.data;
    
    if (question.value) {
      // Get all unique responses as distractor pool (excluding the correct one)
      const distractorPool = allRes.data
        .map(r => r.response)
        .filter(r => r !== question.value?.response);
      
      // Remove duplicates from pool
      const uniquePool = [...new Set(distractorPool)];
      
      // Shuffle pool and take up to 3 distractors
      const distractors = uniquePool
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
        
      // Combine with correct answer and shuffle final options
      options.value = [question.value.response, ...distractors]
        .sort(() => Math.random() - 0.5);
    }
  } catch (err) {
    console.error('Failed to load quiz question', err);
  } finally {
    isLoading.value = false;
  }
};

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

.options-list { margin: 15px 0; display: flex; flex-direction: column; gap: 10px; }
.option-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px; border: 1px solid #eee; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
.option-item:hover { background: #f9f9f9; }
.option-item input { margin-top: 3px; }
.option-item label { flex: 1; cursor: pointer; }

.option-item.correct-highlight {
  border-color: #28a745 !important;
  background-color: #e6ffed !important;
  font-weight: bold;
}

.feedback { padding: 15px; border-radius: 4px; margin-top: 15px; }
.feedback.correct { background: #e6ffed; border: 1px solid #b7eb8f; color: #1e4620; }
.feedback.incorrect { background: #fff1f0; border: 1px solid #ffa39e; color: #5c0011; }
.actions { margin-top: 15px; }
</style>
