# StudioTec

Studio Tec Salon Website

## Project Structure

* `/backend`: Contains the Node.js Express backend server.
* `/frontend`: Contains the React frontend application built with Vite.

## Setup

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* Firebase Project: You need to create a Firebase project to get the necessary configuration values.

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DJ-lezama/StudioTec
   cd StudioTec
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Firebase (Frontend):**
    * In the `frontend` directory, create a copy of the `.env.example` file and name it `.env`.
    * Open the `.env` file and replace the placeholder values (like `"YOUR_API_KEY"`) with your actual Firebase project credentials. You can find these in your Firebase project settings.

        ```text
        # frontend/.env

        VITE_FIREBASE_API_KEY="YOUR_ACTUAL_API_KEY"
        VITE_FIREBASE_AUTH_DOMAIN="YOUR_ACTUAL_AUTH_DOMAIN"
        VITE_FIREBASE_PROJECT_ID="YOUR_ACTUAL_PROJECT_ID"
        VITE_FIREBASE_STORAGE_BUCKET="YOUR_ACTUAL_STORAGE_BUCKET"
        VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_ACTUAL_SENDER_ID"
        VITE_FIREBASE_APP_ID="YOUR_ACTUAL_APP_ID"
        VITE_FIREBASE_MEASUREMENT_ID="YOUR_ACTUAL_MEASUREMENT_ID"
        ```

5. **Go back to the root directory:**
   ```bash
   cd ..
   ```

## Running the Application

You need to run both the backend and frontend servers concurrently.

1. **Open two terminal windows/tabs in the root `StudioTec` directory.**

2. **In the first terminal (Backend):**
   ```bash
   npm run server --prefix backend
   ```
   This will start the backend server, usually on `http://localhost:3000`.

3. **In the second terminal (Frontend):**
   ```bash
   npm run dev --prefix frontend
   ```
   This will start the Vite development server for the frontend, usually on `http://localhost:5173`.

4. **Open your browser** and navigate to the frontend URL provided in the terminal (e.g., `http://localhost:5173`).
