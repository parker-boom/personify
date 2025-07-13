🎨 Personify Design System

## Core Philosophy
- **OpenAI-inspired**: Clean, bold, modern aesthetic
- **Minimal palette**: Pure black (#000) + white only for easy theming
- **Signature element**: Holographic effects on key branding moments
- **Web-focused**: Optimized for desktop/laptop experience (hackathon scope)
- **Styling**: All styles are written in Angular + SCSS for maintainability and learning alignment

## Color System
**Light Mode:**
- Background: White (#FFFFFF)
- Text: Deep Black (#000000)

**Dark Mode:**
- Background: Deep Black (#000000) - OLED friendly
- Text: White (#FFFFFF)

**Accent:**
- Holographic gradient: Used sparingly on "Personify" branding and key CTAs
- Only colored elements in the entire app

## Typography
- **Bold modern fonts** (following OpenAI style)
- Clean hierarchy with generous spacing
- Emojis allowed for personality without breaking color rules
- **Dynamic scaling**: Category circle text scales with weight (1.5-2rem for labels, 2.5-3.5rem for emojis)

## Interactive Elements
- **Shadows**: Allowed, can be holographic colored for premium feel
- **Animations**: Subtle, used on signature "Personify" text and CTA buttons
- **Theme Toggle**: Global placement in top-right corner, always visible across all pages
- **Hover Effects**: Lift animations on buttons, scale effects on category circles

## Theme Implementation
- **Global Theme Service**: Centralized theme management with localStorage persistence
- **App-level Toggle**: Theme toggle positioned absolutely in top-right across all pages
- **Component Integration**: All components use ThemeService for reactive theme changes
- **Design Rule**: Black/white elements invert, colored elements (holographic gradients) stay unchanged
- **Special Cases**: Category circles and subcategory labels remain black for readability on colored backgrounds

## Page-Specific Design

### Home Page
**Layout:** Minimal, center-aligned content on plain background

**Content Structure:**
1. **Title:** "Looking to personalize your ChatGPT?"
2. **Subtitle:** "It's time to Personify your AI assistant."
   - "Personify" = holographic colored + animated (signature brand moment)
3. **Theme Toggle:** Sun/moon toggle, top-right (global placement)
4. **CTA Button:** "Get Started" with holographic colored shadow

### Select Page
**Layout:** Uses LayoutComponent for consistent structure with sidebar

**Content Structure:**
1. **Title:** "What should ChatGPT know about you?"
2. **Subtitle:** "Select the areas you'd like to personalize"
3. **Category Circles:** Dynamic sizing based on weight, emoji + label display
4. **Subcategory Overview:** Vertical list with toggles, black text on colored backgrounds
5. **Start Button:** Conditional "Start customizing" button with holographic shadow
6. **Sidebar:** Progress display with selection management

**Category Circle Design:**
- **Dynamic sizing:** 190px - 280px based on weight
- **Emoji display:** Large emoji above label, scales with weight
- **Text scaling:** Labels scale from 1.5rem to 2rem based on weight
- **Color system:** Pastel backgrounds with colored borders
- **Text color:** Always black for readability

### Flow Page
**Layout:** Uses LayoutComponent with sidebar for progress tracking
**Design:** Chat-style conversational interface with progressive message loading

**Content Structure:**
1. **Chat Interface:** Bot and user message bubbles with realistic conversation flow
2. **Message Types:** Bot statements, bot questions, user input responses
3. **Question Components:** Six interactive question types (slider, text, multi-select, dropdown, toggle)
4. **Progress Sidebar:** Shows current question progress and category completion status
5. **Skip/Complete Options:** Users can skip remaining questions or complete full flow
6. **Profile Pictures:** Bot messages show profile picture based on context (first message, category transitions)

**Message Design:**
- **Bot Messages:** Left-aligned with rounded bubbles and optional profile picture
- **User Messages:** Right-aligned with question-specific interactive components
- **Progressive Loading:** Messages appear with 2-second delays for natural conversation flow
- **Send Animation:** User responses transform from input to sent state with smooth animations

### Loading Page
**Layout:** Full-screen centered animation with cycling messages

**Content Structure:**
1. **Animation Container:** Six spinning elements creating engaging loading visual
2. **Loading Messages:** Cycling messages every 3 seconds ("Personalizing your experience", "Crafting your AI companion", etc.)
3. **Theme Integration:** Animation colors and background adapt to current theme
4. **API Processing:** Automatically processes user answers through backend while showing loading state

**Animation Design:**
- **Spinner Elements:** Six colored elements with staggered rotation animations
- **Message Cycling:** Smooth transitions between loading messages
- **Color Adaptation:** Loading elements use theme-appropriate colors

### Results Page
**Layout:** Full-screen centered content with three-section layout

**Content Structure:**
1. **Title:** "Time to Personify Your ChatGPT" with signature branding
2. **Instructions:** "Copy these & paste them in ChatGPT:" with settings path helper
3. **Settings Helper:** Visual guide showing "SETTINGS → CUSTOMIZE CHATGPT" path
4. **Copy Cards:** Two main cards for CustomInstructionQ1 and CustomInstructionQ2
5. **Memory Section:** Special ChatGPT memory integration with link generation

**Copy Card Design:**
- **Two-column layout:** Side-by-side cards for the two custom instruction fields
- **Interactive textareas:** Read-only textareas with real API response data
- **Copy buttons:** Animated copy buttons with clipboard icons and success states
- **Real-time feedback:** "COPY" transforms to "COPIED" with checkmark animation

**Memory Integration:**
- **Fused logo:** Personify + OpenAI logo combination
- **Memory button:** "Save to ChatGPT's Memory" with automatic URL generation
- **ChatGPT linking:** Memory prompt automatically converts to ChatGPT URL with pre-filled prompt
- **URL encoding:** Spaces converted to + symbols for proper ChatGPT link format

## Component Architecture
- **App Level:** Global theme toggle, always visible
- **Layout Component:** Consistent page structure with sidebar management
- **Sidebar Component:** Shared across Select and Flow pages for different purposes
- **Select Components:** Category circles and subcategory overview
- **Theme Integration:** All components use ThemeService for reactive theming

## Design Principles
- **Less is more**: Every element serves a purpose
- **Brand moments**: Holographic effects only on key "Personify" branding and CTAs
- **Accessibility**: High contrast black/white ensures readability
- **Consistency**: Same spacing, fonts, and patterns across all pages
- **Theme**: All pages must use ThemeService for dark/light mode
- **Desktop-first**: Design is optimized for desktop/laptop; mobile is not a priority for this hackathon
- **Component isolation**: Clear separation between page concerns (Select vs Flow)
