# Manabu - Japanese Learning Helper 🇯🇵

Manabu is a web application designed to help users learn Japanese, tracking progress in Vocabulary, Kanji, and Grammar.

## Project Structure

The project is divided into two main parts:

- **Frontend** (`/`): A React application built with Vite, TypeScript, and standard CSS.
- **Backend** (`/backend`): An API server built with Bun, Express, and SQLite (via Drizzle ORM).

## Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or later)

## Setup & Installation

1.  **Install Frontend Dependencies**
    ```bash
    bun install
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    bun install
    cd ..
    ```

## Running the Application

To run the application locally, you need to start both the frontend and backend servers.

### 1. Start the Backend
The backend runs on port `3333` by default.

```bash
cd backend
bun run dev
```

### 2. Start the Frontend
The frontend runs on port `5173`. Make sure the backend is running first so the frontend can connect to the API.

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start using Manabu.

## Key Features
- **Dashboard**: Track your daily streak, XP, and overall progress.
- **Learn**: Lessons for Vocabulary, Kanji, and Grammar (JLPT N5 level focus).
- **Review**: Quiz system to test your knowledge.

