# Connect-Hrs: Serverless Placement Outreach CRM

A lightning-fast, serverless CRM and outreach tracking dashboard designed specifically for placement cells and HR professionals. Built using Vanilla JavaScript, HTML, and CSS, it leverages Firebase Authentication for secure access control without the overhead of a traditional backend.

## Architecture Overview

```text
Client Web Browser
    │
    ▼
┌──────────────────────────┐
│  Vanilla JS Frontend     │  ← Handles DOM Manipulation & State
└──────────┬───────────────┘
           │
    ┌──────┼───────────────┐
    ▼      ▼               ▼
┌───────┐ ┌─────────────┐ ┌─────────────┐
│ Auth  │ │ Dashboard   │ │ Outreach    │
│ Panel │ │ Statistics  │ │ Logging     │
└───┬───┘ └──────┬──────┘ └──────┬──────┘
    │            │               │
    ▼            ▼               ▼
┌───────────────────────────────────────┐
│  Firebase SDK (Client-Side)           │
└──────────────┬────────────────────────┘
               │ (HTTPS/JSON)
               ▼
┌───────────────────────────────────────┐
│  Google Firebase Cloud (Backend)      │
│  - Authentication (Email/Password)    │
│  - Firestore (NoSQL Database)*        │
└───────────────────────────────────────┘
* If configured for data persistence.
```

## System Output

The system manages the state of various HR and company outreach activities:

| Company Name | HR Contact | Outreach Status | Follow-up Date |
|---|---|---|---|
| Google India | Jane Doe | Responded (Positive) | 2026-10-15 |
| Microsoft | John Smith | Awaiting Reply | N/A |

## Directory Structure

```text
Connect-Hrs/
├── index.html            # Main entry point and Dashboard UI
├── login.html            # Firebase Authentication UI
├── auth.js               # Firebase initialization and auth state listeners
├── app.js                # Core CRM logic and DOM event handlers
├── style.css             # Vanilla CSS styling
└── README.md             # Project documentation
```

## How to Run

### 1. Prerequisites
- A modern web browser.
- A Firebase Project (for Authentication).

### 2. Configuration
1. Open `auth.js`.
2. Replace the placeholder Firebase configuration object with your actual Firebase project credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run the Application
Because this is a serverless, client-side application, no build tools or servers are required.
1. Simply open `login.html` directly in your web browser.
2. Alternatively, serve it using a lightweight local server (e.g., `python -m http.server 8000` or VS Code Live Server).

### 4. Usage
1. **Authentication**: Use the login page to authenticate via Firebase. Unauthenticated users are strictly redirected away from `index.html`.
2. **Dashboard**: Once logged in, use the dashboard to log new company outreach attempts, update statuses, and track follow-ups.

## Key Design Decisions

1. **Serverless Architecture**: By relying entirely on Firebase Authentication and client-side JavaScript, the application achieves zero server maintenance costs and instant deployment via GitHub Pages or Vercel.
2. **Vanilla JS over Frameworks**: For a lightweight CRM, avoiding heavy frameworks like React or Angular drastically reduces initial load times and eliminates the need for complex build pipelines (Webpack/Vite).
3. **Strict Route Guarding**: The `auth.js` script enforces an authentication observer (`onAuthStateChanged`). If a user attempts to access `index.html` without a valid Firebase token, the DOM is hidden and the user is instantly redirected to `login.html`.
