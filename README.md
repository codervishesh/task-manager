# Task Manager
WEBSITE LINK:https://vercel.com/vshu1178-8262s-projects/task-manager
A complete, full-stack Task Manager application built with React and Node.js/Express. It provides a clean, modern UI for managing daily tasks with a fully functional REST API.

## Features
- View, create, update (toggle completion), and delete tasks.
- Filter tasks by All, Pending, or Completed.
- Smooth, responsive UI with optimistic updates.
- RESTful API backend handling data validation.

## Tech Stack
- **Frontend:** React (Vite), native CSS (no UI frameworks used)
- **Backend:** Node.js, Express, UUID
- **Storage:** In-memory array (as per project requirements)

## Setup and Run Instructions

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Assumptions & Trade-offs Made
- **Storage:** I chose to use an in-memory storage structure (a simple array in the Model) as permitted by the instructions to keep the setup minimal and focus on the core architecture and code quality. This means data will cleanly reset when the backend server restarts. If building for production, dropping in a real database like PostgreSQL or MongoDB would be the very next step, but the current layered controller/model architecture makes swapping that out straightforward without rewriting the logic.
- **State Management:** I stuck with React's built-in \`useState\` and \`useEffect\` rather than introducing Redux or the Context API. For an app of this size, local state is significantly cleaner and avoids unnecessary boilerplate code alias over-engineering.
- **Optimistic UI:** On the frontend side, when checking off or deleting a task, I opted to update the UI immediately before the API call finishes. This provides a much snappier user experience. If the API call fails, the UI gracefully rolls back to its previous state.
- **Styling:** I built a custom, premium design using pure CSS instead of relying on a giant overarching framework like Tailwind or Material UI. This demonstrates strong core CSS fundamentals (variables, flexbox, custom checkboxes) while still delivering an exceptionally polished interface.
