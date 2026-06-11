# UniPortal Frontend Fix & Feature Tasks

## Project Context

This project is a university/community portal website where users can:

* Ask questions
* Browse questions by tags
* View posts/info
* Translate content to Hindi using the built-in Hindi button

Your task is to modify ONLY the frontend wherever possible unless absolutely necessary for bug fixes. Keep the existing architecture intact.

---

# TASK 1 — Remove Google Translate Widget Completely

## Problem

A Google Translate integration currently injects:

* A top header/banner
* A floating button at the bottom-right

This is unnecessary because the website already has a dedicated **Hindi button** that translates the page content.

## Required Fix

Completely remove the Google Translate widget and all related UI elements.

## Expected Result

* No Google Translate top banner/header
* No Google Translate floating button
* No automatic Google Translate DOM injection
* Existing Hindi button must continue functioning normally

## What To Remove

Search and remove:

* Google Translate script imports
* `google.translate.TranslateElement`
* Any injected Google Translate container
* Any CSS related to Google Translate
* Any floating translate button

---

# TASK 2 — Fix Question Tag Bug

## Problem

When a user posts a question using a specific tag like:

* Campus Life
* Hostel
* Academics
* Clubs
* Placements
* Orientation
* Miscellaneous

the question is still displayed under the "General" category in the questions feed.

## Required Fix

Ensure the selected tag is correctly:

1. Saved during question creation
2. Retrieved correctly
3. Displayed correctly in the questions list/feed/cards

## Expected Result

If a question is posted with:

* `Hostel`

then the question card/feed item should display:

* `Hostel`

NOT:

* `General`

## Important

Do NOT hardcode tags.
Use the actual selected tag from the question creation form.

---

# TASK 3 — Add Similar Question Suggestions (Fuzzy Search)

## Problem

When users type a new question, there is currently no duplicate/similar-question detection.

## Required Feature

While typing inside the "Ask a Question" input area:

* Dynamically search existing questions/posts
* Show similar results below the input box in real-time

## Matching Logic

Use fuzzy search / partial matching.

Examples:

* Typing: `hostel wifi`
* Should match:

  * `How to fix hostel WiFi issue?`
  * `WiFi not working in hostel`
  * `Hostel internet speed problem`

## UX Requirements

* Show suggestions in a dropdown/list below the input
* Clicking a suggestion should:

  * Redirect to that question/post page directly
* Suggestions should update live while typing
* Debounce input to avoid excessive rendering

## Technical Suggestions

You may use:

* Fuse.js
  OR
* Lightweight fuzzy search implementation

## Search Scope

Search through:

* Existing questions
* Existing informational posts

---

# TASK 4 — Make Website Properly Responsive for Mobile

## Problem

Current mobile view is poorly aligned and not optimized.

## Required Fix

Make the frontend fully responsive for mobile devices.

## Important Constraint

DO NOT modify backend logic.

Frontend-only responsive improvements.

## Main Requirement

### Remove sidebar entirely on mobile view

On smaller screens:

* Hide/remove sidebar completely
* Main content should take full width

## Additional Mobile Improvements

Ensure:

* Proper spacing
* Responsive cards
* No horizontal overflow
* Buttons fit correctly
* Text does not overflow
* Navbar works correctly
* Forms are mobile-friendly
* Question feed looks clean on mobile

## Suggested Breakpoints

Use responsive breakpoints such as:

* 768px
* 640px

## Keep Desktop Intact

Desktop UI should remain mostly unchanged.

---

# TASK 5 — Fix Success Toast/Notification Positioning

## Problem

After posting a question, a small success notification appears:

* "Successfully posted"
* "Question posted successfully"

Currently this notification moves up/down while scrolling.

## Required Fix

Stabilize the toast/notification positioning.

## Expected Result

The notification should:

* Stay fixed in one consistent location
* Not move while scrolling
* Not overlap important UI elements

## Recommended Position

Use one of:

* Top-right
* Bottom-right

## Additional Improvements

Ensure:

* Smooth animation
* Proper z-index
* Mobile responsiveness
* Consistent styling

---

# Final Constraints

## DO NOT

* Rewrite the whole project
* Change backend architecture unnecessarily
* Break existing features
* Remove the Hindi translation button

## DO

* Keep changes modular
* Use reusable components where possible
* Follow existing project styling conventions
* Ensure all features work in both desktop and mobile view

---

# Deliverables

After implementation:

1. Provide modified frontend code
2. Mention all files changed
3. Briefly explain each fix
4. Ensure project builds successfully without errors
