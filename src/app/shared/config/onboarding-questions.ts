import { QuestionContext } from '../models/question.interface';

export const ONBOARDING_QUESTIONS = [
  {
    id: 'onboarding-1',
    prompt: 'Hi! I\'m here to help personalize your ChatGPT experience. What\'s your name?',
    type: 'short_text' as const,
    order: 0,
    categoryId: 'onboarding',
    subcategoryId: 'introduction',
    placeholder: 'Enter your name'
  },
  {
    id: 'onboarding-2', 
    prompt: 'Great! How do you usually use ChatGPT?',
    type: 'multi_select' as const,
    options: ['Homework help', 'Learning new topics', 'Writing assistance', 'Problem solving', 'Research', 'Creative projects'],
    order: 1,
    categoryId: 'onboarding',
    subcategoryId: 'usage'
  },
  {
    id: 'onboarding-3',
    prompt: 'What\'s your main goal for using ChatGPT?',
    type: 'dropdown' as const,
    options: ['Improve my grades', 'Learn faster', 'Get better at writing', 'Solve problems more effectively', 'Just explore and experiment'],
    order: 2,
    categoryId: 'onboarding',
    subcategoryId: 'goals',
    placeholder: 'Select your main goal'
  }
];

export const ONBOARDING_CONTEXT: QuestionContext = {
  categoryId: 'onboarding',
  subcategoryId: 'introduction',
  order: 0
}; 