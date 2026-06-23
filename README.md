# 🚆 Passenger Management System (PMS)

**A frontend-only web application for managing passenger bookings using browser LocalStorage — no backend required.**

---

## 🔗 Live Demo

- **Vercel Production:** [https://passmansys-local-storage.vercel.app](https://passmansys-local-storage.vercel.app)
- **GitHub Pages:** [https://veerasuryahub.github.io/PassManSys---local-storage/](https://veerasuryahub.github.io/PassManSys---local-storage/)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Demo Credentials](#demo-credentials)
- [SDLC](#sdlc)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [How to Run Locally](#how-to-run-locally)
- [User Stories](#user-stories)
- [Acceptance Criteria](#acceptance-criteria)
- [Screenshots](#screenshots)
- [Author](#author)

---

## About

The **Passenger Management System (PMS)** is a government-style web application that allows travel agents to:

- Add, view, update, search, and delete passenger booking records
- View live dashboard statistics (total passengers, gender counts, total revenue)
- All data is stored in the browser using **LocalStorage** — works offline with no server

---

## Features

| Feature | Description |
|---------|-------------|
| Login / Logout | Secure credential validation with session management |
| Add Passenger | Create new booking with full validation |
| View All | Paginated table with filter by PNR or Name |
| Update Passenger | Edit existing records via PNR lookup |
| Search Passenger | Find any passenger by PNR number |
| Delete Passenger | Remove records with confirmation |
| Dashboard Stats | Real-time totals — passengers, gender split, revenue |
| LocalStorage | 100% client-side, no backend or database needed |
| Responsive Design | Works on desktop, tablet, and mobile |

---

## Demo Credentials

| Field | Value |
|-------|-------|
| User ID | `travel123` |
| Password | `Travel@123` |

> **Note:** Demo data includes 4 sample passengers pre-loaded on first use.

---

## SDLC

### Phase 1 — Requirements Gathering

**Functional Requirements:**
- US001: User login with validation
- US002: Add a new passenger booking (PNR, Name, Age, Gender, Origin, Destination, Train, Price)
- US003: Update an existing passenger record
- US004: Delete a passenger record by PNR
- US005: View all passenger records in a table
- US006: Search for a passenger by PNR

**Non-Functional Requirements:**
- Must work without a backend server
- Data must persist between page reloads
- Responsive layout for all screen sizes
- Password must follow security policy

---

### Phase 2 — System Design

**Architecture:** Single-Page Application (SPA)
- One `index.html` file with all sections toggled by JavaScript
- CSS follows a government portal design standard
- JavaScript handles routing, CRUD, and localStorage

**Data Model:**

```json
{
  "pnr": "PNR1001",
  "name": "Surya Kumar",
  "age": 22,
  "gender": "Male",
  "origin": "Madurai",
  "destination": "Chennai",
  "train": "TN01",
  "price": 650
}
```

**Storage Key:** `pms_passengers` (in browser LocalStorage)  
**Session Key:** `pms_loggedIn` (in browser LocalStorage)

---

### Phase 3 — Implementation

**Technologies Used:**
- HTML5 (semantic structure)
- CSS3 (Vanilla CSS, no frameworks)
- JavaScript ES6+ (no libraries or frameworks)
- Font Awesome 6 (icons only)
- Browser LocalStorage API

**File Structure:**
```
/
├── index.html          ← All pages (SPA)
├── css/
│   └── style.css       ← Government-style minimal CSS
├── js/
│   └── app.js          ← All business logic
└── README.md
```

---

### Phase 4 — Testing

| Test Case | Input | Expected | Status |
|-----------|-------|----------|--------|
| TC01 | Login with correct credentials | Redirect to dashboard | ✅ |
| TC02 | Login with wrong credentials | Error toast shown | ✅ |
| TC03 | Login with short user ID (<8 chars) | Validation error | ✅ |
| TC04 | Login with weak password | Validation error | ✅ |
| TC05 | Add passenger with valid data | Success, record saved | ✅ |
| TC06 | Add passenger with duplicate PNR | Error: PNR exists | ✅ |
| TC07 | Add passenger with age = 0 | Validation error | ✅ |
| TC08 | Add passenger with price = 0 | Validation error | ✅ |
| TC09 | View all passengers | Table shows all records | ✅ |
| TC10 | Filter table by PNR | Rows filtered correctly | ✅ |
| TC11 | Edit a passenger record | Record updated in storage | ✅ |
| TC12 | Search by valid PNR | Passenger details shown | ✅ |
| TC13 | Search by invalid PNR | "Not found" message | ✅ |
| TC14 | Delete passenger by PNR | Record removed from storage | ✅ |
| TC15 | Dashboard stats | Correct totals shown | ✅ |
| TC16 | Reset database | Demo data restored | ✅ |
| TC17 | Logout | Session cleared, login shown | ✅ |
| TC18 | Responsive on mobile | Layout adapts correctly | ✅ |

---

### Phase 5 — Deployment

**Platforms:** GitHub Pages & Vercel

**GitHub Pages:**
- Auto-deploys on pushing to the `main` branch.
- Deployed URL: [https://veerasuryahub.github.io/PassManSys---local-storage/](https://veerasuryahub.github.io/PassManSys---local-storage/)

**Vercel Production Deployment:**
- Connected and auto-deploying via GitHub integration.
- Production URL: [https://passmansys-local-storage.vercel.app](https://passmansys-local-storage.vercel.app)

---

## Project Structure

```
PassManSys---local-storage/
│
├── index.html              ← Main SPA file (login + all sections)
│
├── css/
│   └── style.css           ← Minimal government-style CSS
│
├── js/
│   └── app.js              ← All JavaScript logic
│
└── README.md               ← This file
```

---

## Technologies Used

| Technology | Purpose |
|-----------|---------|
| HTML5 | Page structure and forms |
| CSS3 | Styling (government/minimal theme) |
| JavaScript ES6 | SPA routing, CRUD, validation |
| LocalStorage API | Client-side data persistence |
| Font Awesome 6 | Icons |
| GitHub Pages | Free static hosting |
| Vercel | Production hosting & deployment |

---

## How to Run Locally

### Option 1: Direct file
Open `index.html` directly in any modern browser (Chrome, Firefox, Edge).

### Option 2: Local server
```bash
# Python 3
python -m http.server 8080

# Then open: http://localhost:8080
```

### Option 3: VS Code Live Server
Install the "Live Server" extension → Right-click `index.html` → Open with Live Server

---

## User Stories

| ID | User Story |
|----|-----------|
| US001 | As a travel agent, I want to log in securely so that unauthorized users cannot access the system |
| US002 | As a travel agent, I want to add a new passenger booking so that their details are recorded |
| US003 | As a travel agent, I want to update passenger details so that I can correct errors |
| US004 | As a travel agent, I want to delete a passenger record so that cancelled bookings are removed |
| US005 | As a travel agent, I want to view all passengers so that I can review all bookings |
| US006 | As a travel agent, I want to search by PNR so that I can quickly find a specific passenger |

---

## Acceptance Criteria

### Login (US001)
- User ID must be minimum 8 alphanumeric characters
- Password must be minimum 10 characters with at least 1 uppercase, 1 number, 1 special character
- Invalid credentials show error message

### Add Passenger (US002)
- All 8 fields are mandatory
- PNR must be unique
- Age must be > 0
- Price must be > 0
- Success/error message displayed on submission

### Update Passenger (US003)
- PNR field is read-only (cannot be changed)
- All other fields can be edited
- Validation applied same as Add

### Delete Passenger (US004)
- Search by PNR first, review details
- Confirm before permanent deletion
- Toast message on success

### View All (US005)
- Table shows all passenger records
- Mini stats show total count, average price, highest price
- Filter by PNR or Name

### Search Passenger (US006)
- Search by full PNR (case-insensitive)
- Shows all details if found
- Clear error if not found

---

## Author

**Veera Surya**  
GitHub: [@veerasuryahub](https://github.com/veerasuryahub)

---

*© 2026 Passenger Management System. Built for educational and demonstration purposes.*
