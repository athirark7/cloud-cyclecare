# Cycle Care - Comprehensive Project Report

## 1. Project Overview & Architecture
Cycle Care is a modern, decoupled full-stack application designed for tracking menstrual cycles, physical symptoms, and emotional moods. It is separated into a RESTful Backend API and a React-based Frontend, ensuring scalability and maintainability.

- **Backend:** Node.js with Express.js. We chose this for its lightweight, asynchronous handling of HTTP requests.
- **Database:** PostgreSQL, accessed via Prisma ORM. Prisma provides type-safe database queries and an intuitive schema definition, making operations robust and error-free.
- **Frontend:** Next.js (React) using the App Router (`src/app`). We used TypeScript for type safety, reducing runtime errors.
- **Styling:** Custom CSS with modern web design principles (Glassmorphism, CSS Variables, Flexbox/Grid) without heavy UI frameworks, ensuring maximum performance and a customized, premium look.

---

## 2. Database Design (Prisma Schema)
Our database schema in the backend is highly relational, centering around the user. Here are the core models:

- **`User`**: Securely stores the user's `email`, `password` (hashed), and `name`. It acts as the parent entity for all logs.
- **`Cycle`**: Tracks individual menstrual cycles. It stores `startDate`, `endDate`, and dynamically calculates the `cycleLength`. It also has an `isPredicted` flag for AI/algorithmic estimations.
- **`SymptomLog`**: Allows users to log physical symptoms (e.g., cramps, bloating) on specific dates. It includes a `severity` scale (1-5) and can be optionally linked directly to a specific Cycle.
- **`MoodLog`**: Separates emotional tracking from physical symptoms, capturing `moodType` and logging it against a timestamp.
- **`Notification`**: A system structural table to handle alerts (like "Period approaching") featuring `message`, `scheduledFor`, and an `isRead` boolean flag.

---

## 3. Backend Implementation & Security
The backend functions as the brain of the application, securing endpoints and processing data.

- **Authentication Flow (`auth.controller.js`)**: 
  - When a user registers, we use `bcrypt` to hash their password before saving it to the database.
  - Upon login, we verify the hash and issue a **JSON Web Token (JWT)**.
  - **Protecting routes**: We implemented an `auth.middleware.js` that intercepts requests to protected routes (like logging a cycle), verifies the JWT in the `Authorization` header, and attaches the authenticated `userId` to the request object.
- **Cycle Logic (`cycle.controller.js`)**: When storing a cycle, if both a start and end date are provided, the backend automatically calculates the difference in days to determine the `cycleLength`, removing the burden from the frontend client.
- **Dashboard Insights Engine**: We built a specific endpoint (`/api/dashboard/insights`) that aggregates user data. It dynamically queries the database for the user's most recent cycles, calculates their historical **average cycle length**, predicts the **next period date**, and aggregates the most **frequently logged symptoms**.

---

## 4. Frontend Construction (Next.js App Router)
The frontend is heavily component-driven and built for a seamless user experience.

- **Authentication Context (`AuthContext`)**: We created a global React Context to wrap the application. This context manages the state of the `user`, the JWT `token`, and handles the persistent login state when the browser refreshes.
- **Protected Routes**: By hooking into the `AuthContext` inside our `(dashboard)` layout/pages, we ensure that unauthorized users attempting to view their dashboard or log symptoms are immediately redirected to the `/login` page.
- **File Structure Setup**:
  - `/(auth)`: Groups the public-facing pages (`login`, `register`).
  - `/(dashboard)`: Groups authenticated views (`dashboard`, `cycles`, `symptoms`, `profile`). This keeps the Next.js routing organized cleanly.

---

## 5. Key Features Implemented

### 📊 The Intelligent Dashboard
The dashboard (`/dashboard/page.tsx`) serves as the central hub of user interaction:
- **Dynamic Reminders:** It calculates the difference between today's date and the "Predicted Next Period" date from the backend. If the period is within 3 days, it displays a glowing, pulsing UI alert: *🔔 Reminder: Your period is predicted to start soon!*
- **Custom Bar Charts:** Instead of importing a heavy charting library like Chart.js, we engineered an elegant, custom CSS/React chart to display "Cycle Length History". It dynamically calculates the height percentages (e.g., `Math.min(100, (length / 40) * 100)`) to render stylized, gradient-filled vertical bars representing past cycle lengths.
- **Quick Insights:** Displays a cloud of "Common Symptoms" specifically tailored to the logged-in user's historic API logs.
- **Curated Content:** A wellness and resource section providing immediate educational value (e.g., nutrition, yoga) mapped from static datasets natively inside the component.

### 📝 Comprehensive Tracking (Cycles, Symptoms & Moods)
- **Modular Inputs:** We separated the tracking into logical buckets. Users can quickly "Log a New Cycle" without needing to fill out complex forms.
- **Symptoms & Mood API Forms:** We built robust forms that collect the type of symptom/mood and the date. This data gets sent with the JWT token directly to `symptom.controller.js` to persist in the PostgreSQL database.

---

## 6. Design & UX Aesthetic
As emphasized throughout the development, the visual impact was treated as an absolute priority:

- **Glassmorphism Theme:** We used semi-transparent backgrounds (`rgba(255, 255, 255, 0.6)` alongside `backdrop-filter: blur()`) to create elements that appear as frosted glass floating over an animated, smooth gradient background.
- **Typography & Colors:** Utilized modern Next.js specific fonts (Geist) and a highly curated color palette (soft pinks, purples, and vibrant accent colors) to make the app feel medical yet comforting and highly premium.
- **Micro-animations:** Added CSS hover states (cards translating vertically with enhanced drop-shadows), pulsing effects for alerts (`animate-pulse`), and fade-ins on load. This makes the UI feel dynamic, responsive, and incredibly alive.

---

## How It All Comes Together (The Complete Data Flow):
1. **User Access:** User logs in. The frontend retrieves the JWT, saves it, and routes the user to `/dashboard`.
2. **Dashboard Initialization:** The Dashboard component mounts and triggers `fetchInsights()`.
3. **Backend Processing:** The Node.js backend receives the request, securely verifies the JWT, queries the database via Prisma for the user's past cycles and logs, processes the aggregation math, and returns an `insights JSON`.
4. **UI Render:** The frontend consumes the JSON, updates React state, and rapidly re-renders the UI—drawing the custom CSS bar charts to precise mathematical heights, enabling glowing alerts if period dates match, and populating common symptom tags.
