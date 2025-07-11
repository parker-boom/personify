import { QuestionContext } from '../models/question.interface';

export const ONBOARDING_QUESTIONS = [
  {
    id: 'onboarding-intro',
    prompt:
      "Hi, it's nice to finally meet you! Throughout this conversation I am going to ask you a few questions so I can understand you better. I'm only asking about the things you specifically wanted to share and once we're done, I'll set you up with a personalized ChatGPT experience.",
    type: 'statement' as const,
    order: 0,
    categoryId: 'onboarding',
    subcategoryId: 'introduction',
  },
  {
    id: 'onboarding-name',
    prompt:
      "Let's get going, we both have stuff to do! First, what do most people call you?",
    type: 'short_text' as const,
    order: 1,
    categoryId: 'onboarding',
    subcategoryId: 'introduction',
    placeholder: 'Enter your name',
  },
  {
    id: 'onboarding-usage',
    prompt:
      "That's a great name! Next, I want to hear what you plan to use ChatGPT for. Feel free to go into detail, just trying to get a sense of what you're looking for.",
    type: 'long_text' as const,
    order: 2,
    categoryId: 'onboarding',
    subcategoryId: 'usage',
  },
  {
    id: 'onboarding-personality',
    prompt:
      'Those are all great things to do with ChatGPT! One more general question, if your ChatGPT had to embody a person, fictional or real, dead or alive, who would it be? Why them?',
    type: 'long_text' as const,
    order: 3,
    categoryId: 'onboarding',
    subcategoryId: 'goals',
  },
  {
    id: 'onboarding-transition',
    prompt:
      "I wasn't expecting that answer! I'll make sure to make it a reality. Now that I know you a little bit, I am going to dive into some more specific areas, looks like we have some things to talk about!",
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
      'Now I am going to ask you a few questions about you personally. These will help ChatGPT understand what makes you... you! Share as much or as little as you want.',
    type: 'statement' as const,
  },
  {
    id: 'school-statement',
    categoryId: 'school',
    prompt:
      "Now onto the important stuff, seems like you're a student! I want to learn more about your academic life, so ChatGPT can tailor your learning to your needs.",
    type: 'statement' as const,
  },
  {
    id: 'learning-statement',
    categoryId: 'learning',
    prompt:
      "It's not just about what you learn, but how you learn it. I am now going to ask you a few questions about how you prefer to learn things, hopefully this makes ChatGPT a better tutor!",
    type: 'statement' as const,
  },
  {
    id: 'response-statement',
    categoryId: 'response',
    prompt:
      "Obviously, you have preferences about how ChatGPT responds. Sometimes it feels like if ADHD was a chatbot, so let's figure out if you like that high energy or if you prefer something else.",
    type: 'statement' as const,
  },
];

export const ONBOARDING_CONTEXT: QuestionContext = {
  categoryId: 'onboarding',
  subcategoryId: 'introduction',
  order: 0,
};
