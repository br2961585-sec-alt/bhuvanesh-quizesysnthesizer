# Quiz Creator – Next.js + Firebase Realtime Database

A modern, responsive Single-Page Application (SPA) built with **Next.js (App Router)** and **Firebase Realtime Database** that allows users to create quiz questions and view all saved questions with real-time updates and dark mode support.

## 🚀 Features

- **Add Quiz Questions**: Form containing Question text, Option A, Option B, Option C, Option D, and a Correct Answer dropdown selector.
- **Display Questions**: Immediately renders saved questions with highlighted correct answers and assigned unique IDs.
- **Firebase Realtime Database**: Persistent cloud storage using official Firebase SDK methods (`ref`, `push`, `set`, and `get`).
- **Dark Mode Support**: Seamless Light / Dark theme switching powered by `next-themes` and Tailwind CSS.
- **Responsive Design**: Clean UI optimized for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Backend / Database**: [Firebase Realtime Database](https://firebase.google.com/docs/database)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)

---

## 📋 Firebase Requirements & Methods Used

| Function | Firebase Method | Purpose |
| :--- | :--- | :--- |
| **Database Reference** | `ref()` | References the `/questions` node in Firebase Realtime Database |
| **Generate Unique ID** | `push()` | Generates a unique, collision-free push key for each question |
| **Create Question** | `set()` | Saves the question, options, and correct answer at the generated reference |
| **Fetch Questions** | `get()` | Retrieves all stored questions from the database |

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd first_project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory (refer to `.env.example`):
```env
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://test-1-42df7-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test-1-42df7
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```text
├── app/
│   ├── globals.css         # Tailwind styles & dark mode variants
│   ├── layout.js           # Root layout with ThemeProvider and font setup
│   ├── page.js             # Main Quiz Creator single-page application
│   ├── providers.js        # next-themes Provider wrapper
│   ├── quizManager.js      # Firebase database operations (ref, push, set, get)
│   └── ThemeToggle.js      # Light/Dark mode toggle button
├── firebaseConfig.js       # Firebase initialization & database export
├── .env.example            # Example environment variables template
├── .gitignore              # Standard Next.js & environment file exclusions
├── package.json            # Project dependencies and build scripts
└── README.md               # Project documentation
```
