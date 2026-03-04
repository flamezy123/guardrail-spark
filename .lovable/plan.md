
# Neural Layer — AI Socratic Tutor Platform

## Overview
A full-platform AI tutor that forces students to think from first principles. Teachers upload curriculum, the AI uses it as context (RAG-style), and students interact through a Socratic chat — never getting direct answers.

---

## Pages & Features

### 1. Landing Page
- Hero section explaining the product value prop ("AI that teaches, not tells")
- Key features: Socratic Guardrails, Curriculum-Tethered AI, LTI-Ready
- Pricing section ($3-$10/student, $2,500 implementation)
- CTA: "Request a Demo" and "Teacher Login"

### 2. Teacher Authentication
- Email/password login and signup via Supabase Auth
- Teacher profiles table to store name, institution, and preferences
- Protected dashboard routes

### 3. Teacher Dashboard
- **Course Management**: Create courses, organize by subject/semester
- **Curriculum Upload**: Upload PDFs, documents, and text materials per course. These documents are stored and used as AI context
- **Student Analytics**: View per-student chat engagement — how many sessions, topics explored, progress indicators
- **AI Behavior Settings**: Adjust Socratic strictness level (how aggressively the AI redirects vs. hints)

### 4. Student Chat Interface (Public via shareable course link)
- Clean, focused chat UI — no distractions
- Course selector showing available courses
- Real-time streaming AI responses powered by Gemini 3 Flash via Lovable AI
- **Socratic Guardrails** built into the system prompt:
  - Never give direct answers
  - Ask guiding questions to lead students to discover answers
  - Reference only the uploaded curriculum materials
  - Flag when a question falls outside the curriculum scope
- Chat history per student session
- "I'm stuck" button that provides a slightly more direct hint (but still not the answer)

### 5. Student Demo Mode
- A public demo page where prospective institutions can try the Socratic AI with sample curriculum content
- No login required

---

## Backend (Supabase + Edge Functions)

### Database Tables
- `profiles` — teacher accounts (name, institution, role)
- `courses` — teacher's courses (title, subject, description, settings)
- `curriculum_documents` — uploaded materials per course (stored text content used as RAG context)
- `chat_sessions` — student chat sessions linked to courses
- `chat_messages` — individual messages with role (user/assistant)

### Edge Functions
- `chat` — Socratic AI endpoint using Lovable AI (Gemini 3 Flash). Includes hard-coded system prompt with Socratic guardrails + curriculum context injection from the database
- `parse-curriculum` — Processes uploaded documents and extracts text content for AI context

---

## Design
- Clean, modern, education-focused UI
- Light color scheme with a calm blue/indigo primary palette
- Mobile-responsive for student access on any device
- Accessible typography and contrast ratios
