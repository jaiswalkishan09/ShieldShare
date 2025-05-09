# ShieldShare

🔐**Secure Consent-Based Data Sharing System**
This project is a secure platform designed to facilitate the uploading, hashing, encryption, and controlled sharing of sensitive data using a consent-based mechanism. It ensures data privacy by applying cryptographic hashing and asymmetric encryption, and simulates a real-world scenario where users must explicitly grant consent before their data is accessed by external entities (e.g., businesses or organizations).

✨**Key Features**
Data Hashing: Sensitive data (e.g., name, address) is hashed using SHA-256, ensuring raw data is never transmitted or stored.

Consent-Based Access Control:

Users can view incoming data access requests.

Users have full control to approve or reject requests.

Asymmetric Encryption: Upon user consent, data is encrypted using the entity’s public key and securely shared.

Secure Data Transmission: Encrypted data and its hash are sent to a central repository for retrieval.

Decryption Simulation: Entities can decrypt received data using their private key.

Logging & Error Handling (Bonus):

Tracks consent actions, encryption, transmission, and decryption.

Handles consent denials and data access failures gracefully.

🛠 **Technologies Used**
Node.js for backend logic
React.js for frontend

SHA-256 for hashing

RSA for encryption/decryption

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
