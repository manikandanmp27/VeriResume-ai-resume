# VeriResume — Grounded AI Resume Assistant

> **AI-powered resume assistant with Fact Lock anti-hallucination verification, job tailoring, ATS Reality Check parsing simulation, and secure Firebase Authentication.**

[![Frontend Live](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-black.svg?logo=vercel)](https://veri-resume-ai-resume-xpok.vercel.app)
[![Backend Live](https://img.shields.io/badge/Backend-Live%20on%20Render-46E3B7.svg?logo=render)](https://veriresume-backend-13iq.onrender.com)
[![API Health](https://img.shields.io/badge/API%20Health-UP-brightgreen.svg)](https://veriresume-backend-13iq.onrender.com/api/health)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FFA611.svg)](https://firebase.google.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4.svg)](https://ai.google.dev/)

---

## 🌐 Live Production Links

| Resource | Live Production URL |
| :--- | :--- |
| **🚀 Web Application (Frontend)** | **[https://veri-resume-ai-resume-xpok.vercel.app](https://veri-resume-ai-resume-xpok.vercel.app)** |
| **⚡ REST API Service (Backend)** | **[https://veriresume-backend-13iq.onrender.com](https://veriresume-backend-13iq.onrender.com)** |
| **🩺 Health Check Probe** | **[https://veriresume-backend-13iq.onrender.com/api/health](https://veriresume-backend-13iq.onrender.com/api/health)** |
| **📖 Interactive Swagger UI Docs** | **[https://veriresume-backend-13iq.onrender.com/swagger-ui.html](https://veriresume-backend-13iq.onrender.com/swagger-ui.html)** |

---

## 🌟 Overview

Most AI resume tools invent ungrounded accomplishments, fabricate metrics (e.g., *"increased revenue by 80%"*), or introduce complex multi-column formatting tables that break Applicant Tracking Systems (ATS).

**VeriResume** solves this with two foundational pillars:
1. **🛡️ Fact Lock Anti-Hallucination Engine:** Maps every generated bullet point directly to user-supplied source facts. Unverified claims are prominently flagged for review and excluded from the final export until approved.
2. **📊 ATS Reality Check Simulation:** Simulates raw plain-text ATS parser streams, calculates a 0–100 compatibility score, and warns of formatting issues before you apply.

---

## 🏛️ Production Architecture

```text
GitHub Repository (main)
   │
   ├──→ Vercel (React 18 + Vite Frontend)
   │      └── Public SPA with Client-side Routing (https://veri-resume-ai-resume-xpok.vercel.app)
   │
   └──→ Render (Spring Boot 3.3.5 Backend API)
          ├── URL: https://veriresume-backend-13iq.onrender.com
          ├── PostgreSQL (Render Managed Database)
          ├── Google Gemini 1.5 API (Grounded Generation)
          └── Firebase Admin SDK (Server-Side ID Token Verification)
```

---

## 🚀 Key Features

* **Conversational to Grounded Bullets:** Write your work and project experience in natural language. Gemini extracts factual grounding statements and transforms them into strong action bullets.
* **Fact Lock Hub:** Interactive verification meter calculating `% Grounded`, claim status pills (`VERIFIED`, `UNVERIFIED`, `USER_CONFIRMED`, `REJECTED`), and inline editing.
* **ATS Reality Check:** Side-by-side split screen comparing recruiter visual layout against plain-text scanner output with 0–100 readability scoring.
* **Job Description Tailoring & Diff:** Analyzes target JDs, computes match indicators, and non-destructively produces tailored version snapshots with side-by-side diffs.
* **4 ATS-Optimized Templates:** Clean, single-column layouts designed for flawless machine parsing (`Modern`, `Classic`, `Minimal`, `Technical`).
* **Pre-Flight Review & Verified PDF Export:** Comprehensive pre-export audit and 1-click server-side PDF generation.
* **Secure Firebase Authentication:** Client SDK auth with server-side token verification; passwords are never stored in our database.

---

## 🛠️ Tech Stack

### Backend
* **Language/Runtime:** Java 21 / Java 24
* **Framework:** Spring Boot 3.3.5 (Spring Web, Spring Security, Spring Data JPA)
* **Authentication:** Firebase Admin SDK & Server-Side ID Token Verification
* **Database:** PostgreSQL 16 (with in-memory H2 profile for instant local dev)
* **AI Integration:** Google Gemini 1.5 Flash REST API
* **PDF Rendering:** OpenHTMLToPDF / Flying Saucer & Thymeleaf
* **Documentation:** SpringDoc OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
* **Health Monitoring:** `/api/health`

### Frontend
* **Runtime/Bundler:** Node.js 18+ & Vite 6
* **Framework:** React 18 & React Router 6
* **Styling:** Vanilla Tailwind CSS with custom dark slate design tokens
* **Icons:** Lucide React
* **HTTP Client:** Axios with Firebase ID Token dynamic interceptors

---

## ☁️ Production Deployment Guide

### 1. Backend on Render
1. Connect your repository on **[Render.com](https://render.com)** using the [`render.yaml`](file:///e:/Github%20Repo/verita-ai-resume/render.yaml) Blueprint.
2. Render provisions the PostgreSQL database and Spring Boot Docker service automatically.
3. Configure environment variables (`GEMINI_API_KEY`, `CORS_ALLOWED_ORIGINS`).
4. Primary backend URL: `https://veriresume-backend-13iq.onrender.com`.

### 2. Frontend on Vercel
1. Import repository on **[Vercel.com](https://vercel.com)**.
2. Set Environment Variables:
   * `VITE_API_BASE_URL`: `https://veriresume-backend-13iq.onrender.com/api`
   * `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc.
3. Deploy!

---

## 💻 Running Locally

### Prerequisites
* **Java 21 or Java 24**
* **Node.js 18+** & **npm**

### Step 1: Start the Backend (Terminal 1)
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"
```
*API will start on `http://localhost:8080` with in-memory H2 database.*

### Step 2: Start the Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```
*Frontend will start on `http://localhost:5173`.*

### Step 3: Run with Docker Compose (Alternative)
```bash
docker compose up --build
```

---

## 🔒 Security Best Practices
* **Zero Secrets in Git:** Sensitive `.env` files and credentials are in `.gitignore`.
* **Server-Side Token Verification:** Firebase ID tokens are validated cryptographically by Spring Boot.
* **No Database Passwords:** User authentication is offloaded to Firebase.
* **Data Isolation:** All resume and claim database records enforce user ownership via `SecurityUtils.getCurrentUserId()`.
