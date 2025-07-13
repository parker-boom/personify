📘 Project Guide: 
Personify
“Your AI, your way.”

🧠 Overview
Personify is a lightweight, customizable onboarding experience that helps students shape how AI understands and supports them — all without requiring any technical setup, prompt engineering, or configuration knowledge.
It’s designed to feel like a dynamic conversation, not a form. Through chat-like interactions and friendly UI widgets, students can build a tailored version of ChatGPT — one that remembers their learning style, personality, goals, and more.

🪞 Background: What Came Before
This project builds on my earlier work: StudentTuner, a v1 prototype that explored the same problem space — how to make personalization in ChatGPT more accessible to students.
That version was:
A frontend-only tool built in React + Tailwind


Designed around a step-by-step onboarding form


Outputted a “Custom Instructions” block for students to paste into ChatGPT


Proved out the idea that students do benefit from AI personalization — but most don’t know how to do it on their own


While StudentTuner worked well as a proof-of-concept, its structure was rigid, the UX felt more “form” than “flow,” and I wanted more polish and control over UI state.
Hence: Personify.

🛠️ Current Approach
This is a restart of the project — rebuilt from scratch using Angular and Tailwind to move faster, build more flexibly, and learn deeply along the way.
💡 Why Angular?
I’m currently interning at a company that uses Angular heavily (FICO Cloud @ Costco).


Rebuilding this project in Angular helps me learn in a grounded, self-guided way.


Angular’s built-in structure, component isolation, and CLI tools make it a strong fit for building modular onboarding systems like this.


🎨 Why Tailwind?
Rapid styling with minimal CSS overhead


Consistent, expressive UI vocabulary for building polished interactions


Animations, transitions, and layout control baked in — useful for creating an engaging, alive experience without overengineering



🎯 Project Goals
Personify is being developed as part of the OpenAI EdHack 2025 — a 48-hour hackathon focused on building tools that improve education and learning through AI.
👥 Audience
Middle school to college students


Especially those unfamiliar with prompt tuning or AI personalization


Learners who want ChatGPT to “just get them” without needing to overthink how


🎁 Output
A single-page Angular web app


All inputs stay in browser memory — no backend storage


Final product generates:


A Custom Instructions block (2 fields, ~1500 chars each)


An initial message for ChatGPT to “memorize” the student’s personal context



🧬 End-State Vision (Detailed)
🔘 Step 1: Modular Category Selection
User starts by selecting which areas they want to customize:


School Info (school, grade, major)


Learning Style (preferred pace, tone, format)


Personal Info (hobbies, goals, challenges)


Chat Preferences (response length, tone, feedback style)


Each category appears as a selectable bubble, and clicking one reveals sub-options


Order of flow follows the order the user clicked:


e.g. A1 → A2 → B3 → B4 → C2



💬 Step 2: Conversational Onboarding
App guides user through their selected inputs, one at a time


Uses a chat-style interface, but with interactive UI widgets for each response:


Sliders, buttons, dropdowns, text input, etc.


Friendly, scripted responses guide the user through the experience


A live sidebar updates to reflect what the user has shared so far



✨ Step 3: Finalization + AI Integration
At the end, a final chat message presents a button: “Generate My AI Setup”


Clicking the button:


Runs an animation (creation/building moment)


Sends the user’s structured data to the OpenAI API


Groups data into 3 categories:


Learning context


Personality and tone


External interests


The API returns:


A formatted Custom Instructions block


A message to paste into ChatGPT for memory setup



📋 Step 4: Output Delivery
The final output is displayed in a clean, editable UI:


Custom Instructions fields (in textareas with copy buttons)


A “New Chat” button that opens ChatGPT with the pre-filled memory setup prompt


Nothing is stored, and users can repeat the process anytime



🧪 Tech Stack
Framework: Angular 20


Styling: Tailwind CSS


State Management: Local state only (no backend), possibly using Angular services or RxJS


API Integration: Single OpenAI call at final step via fetch or HttpClient


Deploy Target: Likely static host (e.g. Vercel, GitHub Pages, Firebase Hosting)



🔍 Hackathon Criteria Alignment
Impact – Makes personalization easy for students, improves long-term AI support for learning
Creativity – Blends structured onboarding with dynamic, chat-style UI
AI Integration – Uses GPT at the right moment: to synthesize and tailor the user’s setup
Implementation – Fully working Angular app with thoughtful design, zero backend dependencies

📋 Implementation Status: COMPLETE ✅
All core features have been successfully implemented and deployed:

✅ **Step 1: Modular Category Selection**
- Category selection with dynamic sizing based on weight
- Subcategory overview with toggle interface
- Persistent selection state management
- Conditional "Start customizing" button

✅ **Step 2: Conversational Onboarding**
- Chat-style interface with progressive message loading
- Six interactive question types (slider, text, multi-select, dropdown, toggle)
- Bot and user message bubbles with realistic conversation flow
- Skip/complete options for flexible user experience

✅ **Step 3: Finalization + AI Integration**
- OpenAI API integration with pre-saved prompt
- Structured answer data processing through backend API
- Real-time answer collection and validation
- Loading page with animated feedback during API processing

✅ **Step 4: Output Delivery**
- Results page with real OpenAI API response data
- Copy-to-clipboard functionality for custom instructions
- ChatGPT memory integration with automatic URL generation
- Settings path helper for user guidance

🏗️ **Architecture Overview**
**Frontend:** Angular 20 with standalone components and TypeScript
**Backend:** Netlify serverless function with OpenAI API integration
**Data Flow:** Selection → Flow → Loading → API → Results → ChatGPT
**State Management:** Angular services with RxJS observables
**Styling:** SCSS with comprehensive dark/light theme support

🚀 **Deployment Status: LIVE**
**Frontend:** Deployed to Netlify with static hosting
**Backend:** Serverless function handling OpenAI API calls
**Environment:** Production environment with secure API key management
**Status:** Fully functional and accessible to users

