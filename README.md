# ShieldShare

## Prerequisites

- Node.js must be installed on your system.

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
```

---

## Running the Backend Server

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. Create a `.env` file inside the `backend` folder and add the following environment variables:

   ```env
   MYSQL_HOST=""
   MYSQL_USER=""
   MYSQL_PASSWORD=""
   MYSQL_DATABASE=""
   SECRET_KEY=""
   ```

3. From the root directory of the `backend`, run the following commands:
   ```bash
   npm install
   npm start
   ```

---

## Running the Frontend

1. Navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

2. Create a `.env` file inside the `frontend` folder and add the following environment variable:

   ```env
   REACT_APP_BACKEND_URL="http://localhost:5000"
   ```

3. From the root directory of the `frontend`, run the following commands:
   ```bash
   npm install
   npm start
   ```

---

## Environment Setup

- Ensure both **frontend** and **backend** have their `.env` files correctly set up.
- For the backend, you'll need the database credentials and a secret key.
- For the frontend, make sure to point the `REACT_APP_BACKEND_URL` to the correct backend server URL (default: `http://localhost:5000`).

---

## Notes

- **Backend** runs on port `5000` by default.
- **Frontend** runs on port `3000` by default.
- Make sure the backend is running before starting the frontend for proper API functionality.
