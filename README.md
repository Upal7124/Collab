# Collab

Collab is a full-stack skill-exchange platform that helps users find people who can teach the skills they want to learn and who want to learn the skills they can teach.

The core idea is **reciprocal skill matching** rather than AI-based recommendations:

> If I can teach React and want to learn Java, I should be matched with someone who can teach Java and wants to learn React.

## Features

- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- Input validation using Joi
- Helmet security headers
- API rate limiting
- User profiles
- Profile picture uploads
- Skills users can teach and skills they want to learn
- Reciprocal skill-based matching
- Match scores based on overlapping complementary skills
- Send collaboration requests
- View pending collaboration requests
- Accept or reject collaboration requests
- Collaboration request count/notification indicator
- Skill discovery
- Project section
- Meeting scheduling interface

## How Matching Works

Collab does not use AI to decide matches.

For every potential collaborator, the backend compares two directions:

### 1. Skills I can teach → Skills they want to learn

```text
My teaching skills
        ↓
Their learning skills
```

### 2. Skills I want to learn → Skills they can teach

```text
My learning skills
        ↓
Their teaching skills
```

The number of reciprocal matches is used to calculate a compatibility score, and users with the strongest matches are shown first.

### Example

**User A**

- Teaches: React, Node, Python
- Wants to learn: Java, AWS

**User B**

- Teaches: Java, AWS, Docker
- Wants to learn: React, Python

The users have reciprocal matches in both directions, making them a strong potential collaboration match.

## Tech Stack

### Frontend

- React
- Vite
- Axios
- Tailwind CSS
- Lucide React
- Framer Motion

### Backend

- Node.js
- Express
- MySQL
- JWT
- bcrypt
- Joi
- Multer
- Helmet
- express-rate-limit
- CORS
- dotenv

## Project Structure

```text
Collab/
│
├── Server/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validation.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── matchRoutes.js
│   │
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── client/
│   ├── src/
│   │   ├── Components/
│   │   └── ...
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

> If the frontend directory is still named `vite-project` in your local repository, replace `client` with `vite-project` in the structure above.

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

Authentication returns a JWT that is used for protected requests.

### Users

```text
GET /api/users/:id
GET /api/users/top/:id
GET /api/users/skill/:skill
POST /update-skills
```

Protected endpoints use:

```http
Authorization: Bearer <JWT>
```

### Matching

```text
GET /api/matches
```

The logged-in user's ID is obtained from the JWT. The endpoint calculates reciprocal skill compatibility and returns matches ordered by score.

### Collaboration Requests

```text
POST  /api/collab-requests
GET   /api/collab-requests
PATCH /api/collab-requests/:requestId/accept
PATCH /api/collab-requests/:requestId/reject
GET   /api/collab-requests-count
```

The sender of a request is determined from the authenticated JWT rather than being trusted from the client.

## Authentication Flow

```text
Login
  ↓
Backend validates credentials
  ↓
JWT generated
  ↓
Token stored by frontend
  ↓
Frontend sends:
Authorization: Bearer <token>
  ↓
authMiddleware verifies token
  ↓
req.user contains authenticated user
```

This prevents clients from simply changing a `userId` in a request to act as another user.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Upal7124/Collab.git
cd Collab
```

### 2. Install backend dependencies

```bash
cd Server
npm install
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

If the frontend directory is still called `vite-project`:

```bash
cd vite-project
npm install
```

## Environment Variables

Create a `.env` file inside `Server/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=testdb
JWT_SECRET=your_super_secret_key
```

Do not commit `.env` to Git.

## Database

The backend uses MySQL.

Create the database specified by:

```env
DB_NAME=testdb
```

and configure the MySQL credentials in `Server/.env`.

The application expects user and collaboration-request data to be available through the corresponding MySQL tables.

## Running the Project

### Start the backend

```bash
cd Server
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

## Security

The backend includes several basic production-oriented security measures:

- Passwords are hashed with bcrypt rather than stored as plain text.
- JWT authentication protects private API endpoints.
- Joi validates incoming authentication data.
- Helmet adds HTTP security headers.
- Rate limiting helps reduce excessive API requests.
- CORS restricts browser access to configured frontend origins.
- Sensitive identity information such as the authenticated user's ID is taken from the JWT where appropriate.
- `.env`, `node_modules`, and uploaded files should not be committed to Git.

## Future Improvements

Potential improvements include:

- Refresh-token based authentication
- More granular rate limits for different API endpoints
- Stronger file upload validation and size limits
- Database indexes for faster matching
- Normalizing skills into a dedicated database table
- Collaboration history and completed-collaboration tracking
- Ratings and reviews
- User activity/popularity metrics
- Improved notification system
- Production deployment configuration
- Automated tests

## Author

**Upal Ghosh**

Built as a full-stack skill-exchange and collaboration platform.
