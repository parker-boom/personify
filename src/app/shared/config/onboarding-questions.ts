import { QuestionContext } from '../models/question.interface';

export const ONBOARDING_QUESTIONS = [
  {
    id: 'onboarding-intro',
    prompt:
      'Hi! I am going to ask you some questions based on what you requested, and using your answers, I will help update your ChatGPT to know you better.',
    type: 'statement' as const,
    order: 0,
    categoryId: 'onboarding',
    subcategoryId: 'introduction',
  },
  {
    id: 'onboarding-name',
    prompt: "Let's get started with an easy one. What's your name?",
    type: 'short_text' as const,
    order: 1,
    categoryId: 'onboarding',
    subcategoryId: 'introduction',
    placeholder: 'Enter your name',
  },
  {
    id: 'onboarding-usage',
    prompt:
      "It's nice to meet you. Can you please tell me the types of things you currently use ChatGPT for? Just trying to get a sense of what you're looking for.",
    type: 'long_text' as const,
    order: 2,
    categoryId: 'onboarding',
    subcategoryId: 'usage',
  },
  {
    id: 'onboarding-personality',
    prompt:
      "Got it, that defintely helps. Here's a fun one: if ChatGPT could represent any character or person, who would you want it to be? Why them?",
    type: 'long_text' as const,
    order: 3,
    categoryId: 'onboarding',
    subcategoryId: 'goals',
  },
  {
    id: 'onboarding-transition',
    prompt:
      "Sounds right to me. Now that I have a general idea of who you are, I am going to ask you some more specific questions. Feel free tell me as much or as little as you'd like. When we're all done, I'll personalize ChatGPT to your needs.",
    type: 'statement' as const,
    order: 4,
    categoryId: 'onboarding',
    subcategoryId: 'transition',
  },
];

export const CATEGORY_STATEMENTS = [
  {
    id: 'personal-statement',
    categoryId: 'personal',
    prompt:
      "Let's continue with some personal questions. This information will help ChatGPT get a better idea of who you are.",
    type: 'statement' as const,
  },
  {
    id: 'school-statement',
    categoryId: 'school',
    prompt:
      "Now onto the important stuff, seems like you're a student! I want to learn more about your academic life, so ChatGPT can get you the right information.",
    type: 'statement' as const,
  },
  {
    id: 'learning-statement',
    categoryId: 'learning',
    prompt:
      'Moving on, I am  going to ask you a few questions about how you prefer to learn things. This will make ChatGPT more useful for studying!',
    type: 'statement' as const,
  },
  {
    id: 'response-statement',
    categoryId: 'response',
    prompt:
      'Now I want to know how you like ChatGPT to respond. Please just share your preferences for how its personality should be.',
    type: 'statement' as const,
  },
];

export const ONBOARDING_CONTEXT: QuestionContext = {
  categoryId: 'onboarding',
  subcategoryId: 'introduction',
  order: 0,
};
