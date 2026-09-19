# Connect-Hrs: Placement Outreach Tracker

A web-based CRM and placement outreach tracking system designed to streamline contact management for university placement cells (e.g., NIT Mizoram). The application provides Google Authentication, a directory of target companies filterable by region and category, and a CRM form to track outreach statuses and interaction notes.

## Architecture Overview

\\\
Web Browser (Client)
    │
    ▼
┌──────────────────────────┐
│  Firebase Auth (Google)  │  ← Secure Login / Session Management
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  DOM & Event Handling    │  ← Vanilla JavaScript (app.js)
└──────────┬───────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌────────┐  ┌──────────┐
│Company │  │ CRM Form │
│Filter  │  │ Tracker  │
└───┬────┘  └────┬─────┘
    │            │
    ▼            ▼
┌──────────────────────────┐
│  Local Storage / DB      │  ← Outreach contacts & notes saving
└──────────────┬───────────┘
               ▼
        Activity Timeline
   (Contact, Status, Notes, Date)
\\\

## System Output

The system allows users to view and export the outreach tracking list. 
Example of CRM records generated and exportable to CSV:

| Company | Contact Name | Status | Email / LinkedIn | Interaction Notes |
|---|---|---|---|---|
| Optiver | John Doe | Emailed | john@optiver.com | Sent connection request on Monday. |
| Google | Jane Smith | Meeting Scheduled | jane.s@google.com | Initial screening call planned. |

## Directory Structure

\\\
├── index.html                  # Main application UI and structure
├── style.css                   # Custom CSS styling (Inter font, responsive layout)
├── app.js                      # Application logic, Firebase integration, and CRM state management
└── README.md                   # Project documentation
\\\

## How to Run

### 1. Prerequisites
- A modern web browser.
- A local web server (like Live Server or Python HTTP server) to run the site (Firebase Auth requires http://localhost or https).

### 2. Install Dependencies
No 
pm packages or heavy frameworks are required. The project uses standard HTML/CSS/JS with Firebase loaded via CDN.

### 3. Run the Application

Using Python:
\\\ash
# Start a local web server
python -m http.server 8000
\\\
*Alternatively, use the "Live Server" extension in VS Code.*

### 4. Usage
1. Open the application URL (e.g., http://localhost:8000).
2. Click **Sign in with Google** to authenticate.
3. Browse the **Target Companies** directory and filter by *Region* (India, Global) or *Category* (Quant, Big Tech, Services, Fintech).
4. Use the **CRM Outreach Tracker** to log new contacts, specify their status (To Contact, Emailed, Meeting Scheduled), and save notes.
5. Click **Export to CSV** to download the CRM data.

## Key Design Decisions

1. **Serverless Architecture**: By leveraging Firebase for Authentication and frontend technologies for the UI, the application runs entirely in the browser without requiring a dedicated backend server.
2. **Vanilla JavaScript**: Chosen for simplicity, fast execution, and avoiding the overhead of heavy frameworks like React or Angular for a straightforward CRM tool.
3. **Data Export Capability**: Added a CSV export feature ensuring that the placement team can port data easily to Excel or other university management software.
4. **Responsive Layout**: CSS variables and flexible box models ensure the UI works consistently across desktop and mobile devices.
